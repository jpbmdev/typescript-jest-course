import { Launcher } from "../app/Launcher";
import { Server } from "../app/Server/Server";

jest.mock("../app/Server/Server");

describe("Launcher test suite", () => {
  test("create sever", () => {
    new Launcher();
    expect(Server).toHaveBeenCalled();
  });

  test("launch app", () => {
    const launchAppMock = jest.fn();
    Launcher.prototype.launchApp = launchAppMock;
    new Launcher().launchApp();
    expect(launchAppMock).toBeCalled();
  });
});
