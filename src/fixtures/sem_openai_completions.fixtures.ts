export const SemOpenaiCompletionsFixtures = [
    { id: 0, json: '{model: "gpt-3.5-turbo",messages: [{"role": "system", "content": "You are an HTML parser."},{"role": "user", "content": "Parse the following HTML code of an ecommerce page and identify the elements for thumbnail, description and price (it could have two prices because they use complementary coins, so report both in that case). Then generate a JSON with the precise html tag to extract these values (not the actual values) from the original HTML code: <html_element>"},}' },
  ];
  