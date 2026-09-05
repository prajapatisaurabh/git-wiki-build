import { inngest } from "./client.js";
import { helloworld } from "./functions/helloworld.js";
import { indexRepo } from "./functions/indexRepo.js";


export { inngest }

export const functions = [helloworld, indexRepo];