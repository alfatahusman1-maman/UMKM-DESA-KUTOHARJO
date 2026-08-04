import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import LoginForm from "../components/LoginForm";
import { signIn } from "next-auth/react";

describe("LoginForm Component Tests", () => {
  it("should render form inputs and submit button properly", () => {
    render(<LoginForm loginFormTitle="Selamat Datang Admin" />);

    expect(screen.getByText("Selamat Datang Admin")).toBeInTheDocument();
    expect(screen.getByLabelText(/Alamat Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kata Sandi/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Masuk Sekarang/i })).toBeInTheDocument();
  });

  it("should allow user to type email and password", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/Alamat Email/i);
    const passwordInput = screen.getByLabelText(/Kata Sandi/i);

    await user.type(emailInput, "admin@korowelangkulon.desa.id");
    await user.type(passwordInput, "admin123");

    expect(emailInput).toHaveValue("admin@korowelangkulon.desa.id");
    expect(passwordInput).toHaveValue("admin123");
  });

  it("should trigger signIn action on form submit", async () => {
    const user = userEvent.setup();
    (signIn as any).mockResolvedValueOnce({ error: null });

    render(<LoginForm />);

    await user.type(screen.getByLabelText(/Alamat Email/i), "admin@korowelangkulon.desa.id");
    await user.type(screen.getByLabelText(/Kata Sandi/i), "admin123");
    await user.click(screen.getByRole("button", { name: /Masuk Sekarang/i }));

    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "admin@korowelangkulon.desa.id",
      password: "admin123",
      redirect: false,
    });
  });
});
