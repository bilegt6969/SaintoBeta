import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: {
    projectId: projectId || process.env.SANITY_STUDIO_PROJECT_ID,
    dataset,
  },
});
