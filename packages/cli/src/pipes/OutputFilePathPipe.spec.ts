import {ProvidersInfoService} from "@tsed/cli";
import {ClassNamePipe} from "./ClassNamePipe";
import {OutputFilePathPipe} from "./OutputFilePathPipe";

describe("OutputFilePathPipe", () => {
  it("should return the outputfile", () => {
    const providers = new ProvidersInfoService();
    providers.add({
      name: "Controller",
      value: "controller",
      model: "{{symbolName}}.controller"
    });

    const classPipe = new ClassNamePipe();
    classPipe.providers = providers;

    const pipe = new OutputFilePathPipe(classPipe);
    pipe.providers = providers;

    pipe.transform({type: "controller", name: "test"}).should.deep.eq("controllers/TestController");
    pipe.transform({type: "controller", name: "test", baseDir: "other"}).should.deep.eq("other/TestController");
    pipe.transform({type: "server", name: "server"}).should.deep.eq("Server");
  });
});
