import { inngest } from "../client.js";

export const helloworld = inngest.createFunction(
    { id: "hello-world", name: "Hello World", triggers: [{ event: "test/hello.world" }] },
    async ({ event, step }) => {
        return { message: "Hello World!" };
    }
);
