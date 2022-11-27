/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-render-in-setup */
import { Login } from "../login";
import * as ReactDOM from "react-dom";
import { fireEvent, waitFor } from "@testing-library/react";
import { LoginService } from "../services/LoginService";

describe("Login component tests", () => {
  let container: HTMLDivElement;
  const loginServiceSpy = jest.spyOn(LoginService.prototype, "login");

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    ReactDOM.render(<Login />, container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container.remove();
  });

  test("Renders correctly initial component", () => {
    const inputs = container.querySelectorAll("input");
    expect(inputs).toHaveLength(3);
    expect(inputs[0].name).toBe("login");
    expect(inputs[1].name).toBe("password");
    expect(inputs[2].name).toBe("");
  });

  test("Renders correctly inital document with data-test query", () => {
    expect(
      container.querySelector("[data-test='login-form']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-test='login-input']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-test='password-input']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-test='submit-button']")
    ).toBeInTheDocument();
  });

  test("Passes credentials correcty", () => {
    const inputs = container.querySelectorAll("input");
    const loginInput = inputs[0];
    const passwordInput = inputs[1];
    const loginButton = inputs[2];

    fireEvent.change(loginInput, { target: { value: "someUser" } });
    fireEvent.change(passwordInput, { target: { value: "somePass" } });
    fireEvent.click(loginButton);
    expect(loginServiceSpy).toBeCalledWith("someUser", "somePass");
  });

  test("Renders correctly status label - invalid login", async () => {
    loginServiceSpy.mockResolvedValueOnce(false);
    const inputs = container.querySelectorAll("input");
    const loginButton = inputs[2];
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(container.querySelector("label")).toBeInTheDocument();
    });
    await waitFor(() =>
      expect(container.querySelector("label")).toHaveTextContent("Login failed")
    );
  });

  test("Renders correctly status label - succesfull login", async () => {
    loginServiceSpy.mockResolvedValueOnce(true);
    const inputs = container.querySelectorAll("input");
    const loginButton = inputs[2];
    fireEvent.click(loginButton);
    await waitFor(() =>
      expect(container.querySelector("label")).toBeInTheDocument()
    );
    await waitFor(() =>
      expect(container.querySelector("label")).toHaveTextContent(
        "Login successful"
      )
    );
  });
});
