import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import Button from "../components/ui/button";

describe("Button", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  const locale = "en";
  const messages = require(`../../messages/${locale}.json`);

  useRouter.mockImplementationOnce(() => ({
    query: { locale: locale },
  }));

  it("renders a button", () => {
    render(
      <NextIntlClientProvider messages={messages} locale={locale}>
        <Button label="Test Button" />
      </NextIntlClientProvider>,
    );

    const heading = screen.getByRole("button");

    expect(heading).toBeInTheDocument();
  });
});
