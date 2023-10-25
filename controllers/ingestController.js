const base = 'https://hacker-news.firebaseio.com/';
import {
  createQuery,
  selectCommentQuery,
  selectStoryQuery,
} from '../db/index.js';


export async function getMostRecentStory() {
  const story = await fetch(base + `v0/maxitem.json`).then(
    processChunkedResponse
  );

  console.log('the story: ', story);

  // consumeData(story);
}

/**
 * Retrieves top stories from HN API
 * @async
 */
export async function getTopStories() {
  console.log('starting');
  const topStories = await fetch(base + 'v0/topstories.json').then(
    processChunkedResponse
  );

  // With the Interger[] we pass to the ingestor to fulfull the data
  const result = await ingestData(topStories.slice(0, 100), 'story');

  // const result = await ingestData(testData.slice(0, 100), 'story');
  console.log(result.length, ' items ingested');
}

/**
 * This helper function receives a ByteStream and mutates
 * into a String using 9th Level Magic then parses to Json.
 * @param {Promise<Response>} response - Response
 * @returns json of accumulated http chunks received
 */
function processChunkedResponse(response) {
  let text = '';
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return readChunk();

  function readChunk() {
    return reader.read().then(appendChunks);
  }

  function appendChunks(result) {
    const chunk = decoder.decode(result.value || new Uint8Array(), {
      stream: !result.done,
    });

    text += chunk;

    if (result.done) {
      return JSON.parse(text);
    } else {
      return readChunk();
    }
  }
}

export async function checkDB(id, type) {
  console.log('lookup: ', id, type);

  if (type === 'story') {
    const story = await selectStoryQuery(id);
    console.log('story check: ', story);
    return story;
  } else if (type === 'comment') {
    const comment = await selectCommentQuery(id);
    console.log('comment check: ', comment);
    return comment;
  }
}

export async function fetchFromHN(id) {
  return await fetch(base + `v0/item/${id}.json`).then(processChunkedResponse);
}

/**
 * This is where the magic is, implementing a simple
 * work queue to hold a local copy of data and draining
 * it to mutate and store into the result array
 * @param {Integer[]} data - Array of IDs
 * @param type
 */
export async function ingestData(data, type) {
  let queue = [...data];
  let result = [];

  for (let i = 0; i < queue.length; i++) {
    let selectItem = await checkDB(queue[i], type);

    if (selectItem === null) {
      console.log(type, 'not found');
      console.log('fetching: ', queue[i]);

      selectItem = await fetchFromHN(queue[i]);
      createQuery(selectItem, type);
    } else {
      console.log('story found..');
    }

    console.log('cursor: ', selectItem);

    result.push(selectItem);
  }

  return result;
}

/**
 * Get story is a helper function for {@link ingestData}
 * to recurse the kids field and build out comment trees
 * @param {Story} item
 * @param type
 */
export async function getComments(item, type) {
  console.log('getting comments...', item.id, type);

  if (!item.kids) return item;
  const kids = await ingestData(item.kids, type);

  let newKids = [];

  for (let i = 0; i < kids.length; i++) {
    console.log('going deeper....');
    const temp = await getComments(kids[i], 'comment');
    console.log(temp);
    newKids.push(temp);
  }

  delete item['kids'];
  item['kids'] = newKids;

  return item;
}

/**
 * ConsumeData is the beginnings of a tree crawler
 * that will traverse stories and thier comments
 * recursively.
 *
 * @param {Integer} data Starting point ID
 */
// async function consumeData(data) {
//   const start = data;
//   const end = start - 100;
//   let result = [];

//   console.log('consuming...');

//   for (let i = start; i > end; i--) {
//     const story = await fetch(base + `v0/item/${i}.json`).then(
//       processChunkedResponse
//     );
//     result.push(createQuery(story));
//   }
// }

const testData = [
  38012032, 38012662, 38012008, 38013668, 38012263, 38012311, 38011432,
  37985489, 38011421, 38010267, 38012716, 38009377, 38012126, 38013429,
  38013157, 38013151, 38011085, 38012380, 37974743, 38008461, 38010244,
  38002752, 38010718, 38012202, 38009372, 37999527, 38009175, 38010384,
  38010391, 38011728, 37994460, 37998923, 38009174, 38009458, 38009963,
  37979590, 38012127, 38011217, 37999035, 38000723, 38010429, 38007906,
  38012207, 38006814, 38013064, 38007028, 38009202, 38009172, 37975526,
  37975285, 37974865, 38000154, 38008176, 38010860, 37996295, 37997246,
  38000824, 38008987, 37975558, 37993575, 38002305, 37996712, 38002665,
  38008772, 38010407, 37998147, 37975306, 37995155, 37996999, 37974829,
  37982621, 38004178, 38008487, 38005461, 37999164, 37975413, 37996291,
  38005027, 38010300, 38002871, 38003233, 38000551, 38010563, 38007725,
  37995119, 38011043, 37977632, 38006512, 37999380, 37974897, 38004721,
  38010044, 38001784, 38008546, 37999172, 38002026, 38009663, 38000843,
  38008675, 38008395, 37996918, 38010063, 37994725, 37984404, 37995254,
  38001361, 38001056, 38002635, 38010633, 38000160, 38004699, 37998730,
  38004431, 38004099, 37997175, 37989773, 37996143, 37996792, 38008822,
  37995761, 37998540, 38007414, 38009764, 38008709, 38004484, 37993202,
  38003779, 38002012, 37992513, 38001041, 38003642, 37982149, 38002800,
  38006607, 38007873, 38002264, 37995718, 38002461, 37998739, 37994387,
  37998691, 37993702, 38005696, 38003292, 37996988, 37998983, 37996817,
  37976894, 37985777, 38002100, 37997069, 37996891, 37999623, 37990646,
  37993969, 37989815, 38001335, 38008876, 37982137, 38003970, 37979930,
  38002417, 38003664, 38006151, 37992104, 38003211, 37996991, 37991295,
  38001099, 37981683, 38002359, 37988585, 37990621, 38004717, 38004610,
  37991401, 37977938, 38004364, 38006455, 37982447, 37989413, 38003313,
  38006890, 38008100, 38009379, 38009358, 37982049, 38003104, 37981294,
  37978687, 38004069, 37987877, 37992481, 38006204, 37996780, 37978060,
  37995875, 38001523, 38002076, 38007010, 37995998, 37980626, 38006125,
  37988483, 38006088, 38000766, 37982524, 37999349, 38000275, 38008898,
  37995916, 37991695, 37988089, 37991191, 38001916, 38007717, 38006363,
  38011370, 37983386, 37975248, 37974734, 37999197, 38010839, 37991746,
  38000330, 38004457, 37979758, 38005201, 37986821, 38006784, 38002863,
  37978084, 38006646, 38004594, 37985007, 37982495, 37990528, 37987812,
  38004296, 37982776, 37977957, 38002210, 38006320, 37982948, 38003883,
  37983349, 38005846, 37979841, 38003459, 37983864, 37987392, 37975090,
  37989614, 37989875, 38007640, 37996057, 37977502, 38004952, 37981925,
  37999586, 37985779, 38003906, 38000981, 38004674, 37990247, 37985005,
  37974781, 38006401, 38003023, 37994561, 37987573, 38002854, 37992725,
  38006094, 38004404, 37999405, 37995279, 37975276, 38003544, 37994740,
  37999143, 38002043, 38005548, 38010404, 38001791, 37980323, 37974879,
  37981939, 37978195, 37982655, 37981109, 37996802, 38000841, 37993003,
  38004814, 37985450, 37990750, 37978413, 38004059, 38005311, 37988857,
  38001924, 37996642, 38004709, 37979635, 37976091, 37984567, 37987780,
  38003296, 37989130, 37990338, 37976161, 37990990, 37984382, 37985365,
  37980497, 37984108, 37990482, 37996511, 38001574, 37984167, 37991909,
  37988638, 37990905, 37996982, 37980609, 37996958, 37992593, 37996721,
  37977768, 37987061, 37975944, 37977174, 37983821, 37978483, 38000694,
  37989098, 37986480, 37983903, 37993298, 37985972, 37998984, 37993018,
  37979787, 37994469, 37998761, 37980466, 37981149, 37992409, 37988560,
  38004684, 37999250, 37995325, 37991238, 37997474, 37987876, 37990519,
  37987367, 37986046, 37975252, 37977530, 37979793, 38008323, 37994527,
  37988582, 37976309, 37993047, 37987784, 37987726, 37985630, 37991049,
  37974709, 37978561, 37991860, 37997056, 37975967, 37990180, 37989132,
  37993121, 37990523, 38000698, 37993940, 38008590, 37978263, 37980846,
  37999249, 37999630, 37992942, 37983444, 37991099, 37990675, 37977444,
  37980563, 38002587, 38005677, 37978551, 37995045, 38001846, 37983729,
  37990031, 37987744, 37993957, 38006101, 37982175, 37998619, 37981963,
  37991518, 37991413, 37975166, 37990833, 37981323, 37984461, 38000903,
  37980720, 37983346, 37976772, 37977719, 37988998, 37987818, 37996123,
  37975441, 37978169, 37974804, 37981233, 37978118, 37990168, 37984202,
  38000190, 37991517, 37995384, 37990690, 37975575, 37983538, 38000679,
  38003179, 37992647, 37979299, 37979854, 37982318, 37978089, 37974929,
  37990354, 37991439, 37975549, 37983966, 37980638, 37981813, 37978501,
  37989545, 37980056, 37983978, 37985176, 37984224, 37992804, 37975694,
  37980416, 37977709, 37997423, 38002013, 37977187, 37993175, 37976602,
  37976579, 37976110, 37976021, 37991349, 37975488, 37990414, 37981804,
  37974878, 37975633, 37988959, 37984838, 37987639, 37993075, 37991863,
  37995427, 37980822, 37995950, 37980585, 37993028, 37975716, 37980067,
  37986055, 37985921, 38003497, 37988437, 37982407, 37980356, 37983795,
  37985608, 37984479, 37975268, 37980487, 37979790, 37981879, 37981125,
  38000106, 37980268, 37989527,
];
