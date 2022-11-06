import { LoginHandler } from "../../app/Handlers/LoginHandler";
import {
  HTTP_CODES,
  HTTP_METHODS,
  SessionToken,
} from "../../app/Models/ServerModels";
import { Utils } from "../../app/Utils/Utils";

describe("LoginHandler test suite", () => {
  let loginHandler: LoginHandler;

  const requestMock = {
    method: "",
  };
  const responseMock = {
    writeHead: jest.fn(),
    write: jest.fn(),
    statusCode: "",
  };
  const authorizerMock = {
    generateToken: jest.fn(),
  };

  const getRequestBodyMock = jest.fn();

  const someSessionToken: SessionToken = {
    tokenId: "test",
    userName: "someUserName",
    valid: true,
    expirationTime: new Date(),
    accessRights: [1, 2, 3],
  };

  beforeEach(() => {
    loginHandler = new LoginHandler(
      requestMock as any,
      responseMock as any,
      authorizerMock as any
    );
    Utils.getRequestBody = getRequestBodyMock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("options request", async () => {
    requestMock.method = HTTP_METHODS.OPTIONS;
    await loginHandler.handleRequest();
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK);
  });

  test("not handled http method", async () => {
    requestMock.method = "random";
    await loginHandler.handleRequest();
    expect(responseMock.writeHead).not.toHaveBeenCalled();
  });

  test("post request with valid login", async () => {
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockReturnValue({
      username: "someUser",
      password: "password",
    });
    authorizerMock.generateToken.mockReturnValueOnce(someSessionToken);
    await loginHandler.handleRequest();
    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED);
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.CREATED, {
      "Content-Type": "application/json",
    });
    expect(responseMock.write).toBeCalledWith(JSON.stringify(someSessionToken));
  });

  test("post request with invalid login", async () => {
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockReturnValue({
      username: "someUser",
      password: "password",
    });
    authorizerMock.generateToken.mockReturnValueOnce(null);
    await loginHandler.handleRequest();
    expect(responseMock.statusCode).toBe(HTTP_CODES.NOT_fOUND);
    expect(responseMock.write).toBeCalledWith("wrong username or password");
  });

  test("post request with unexpected error", async () => {
    requestMock.method = HTTP_METHODS.POST;
    getRequestBodyMock.mockRejectedValueOnce(
      new Error("something went wrong!!")
    );
    await loginHandler.handleRequest();
    expect(responseMock.statusCode).toBe(HTTP_CODES.INTERNAL_SERVER_ERROR);
    expect(responseMock.write).toBeCalledWith(
      "Internal error: something went wrong!!"
    );
  });
});
