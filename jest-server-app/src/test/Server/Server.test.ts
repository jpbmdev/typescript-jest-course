import { Server } from "../../app/Server/Server";
import { LoginHandler } from "../../app/Handlers/LoginHandler";
import { Authorizer } from "../../app/Authorization/Authorizer";
import { DataHandler } from "../../app/Handlers/DataHandler";
import { UsersDBAccess } from "../../app/Data/UsersDBAccess";

jest.mock("../../app/Handlers/LoginHandler");
jest.mock("../../app/Handlers/DataHandler");
jest.mock("../../app/Authorization/Authorizer");
jest.mock("../../app/Data/UsersDBAccess");

const requestMock = {
  url: "",
};
const responsesMock = {
  end: jest.fn(),
};
const listenMock = {
  listen: jest.fn(),
};

jest.mock("http", () => ({
  createServer: (cb: any) => {
    cb(requestMock, responsesMock);
    return listenMock;
  },
}));

describe("Server test suite", () => {
  test("should create server on port 8080", () => {
    new Server().startServer();
    expect(listenMock.listen).toBeCalledWith(8080);
  });

  test("should handle login requests", () => {
    requestMock.url = "http://localhost:8080/login";
    const handleRequestSpy = jest.spyOn(
      LoginHandler.prototype,
      "handleRequest"
    );
    new Server().startServer();
    expect(handleRequestSpy).toBeCalled();
    expect(LoginHandler).toBeCalledWith(
      requestMock,
      responsesMock,
      expect.any(Authorizer)
    );
  });

  test("should handle data requests", () => {
    requestMock.url = "http://localhost:8080/users";
    const handleRequestSpy = jest.spyOn(DataHandler.prototype, "handleRequest");
    new Server().startServer();
    expect(DataHandler).toBeCalledWith(
      requestMock,
      responsesMock,
      expect.any(Authorizer),
      expect.any(UsersDBAccess)
    );
    expect(handleRequestSpy).toBeCalled();
  });
});
