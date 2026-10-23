import { jest } from "@jest/globals";

jest.unstable_mockModule("../repositories/entriesRepository.js", () => ({
  isValidId: jest.fn(() => true),
  getAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn((data) => ({ _id: "fake-id", ...data })),
  updateById: jest.fn(),
  removeById: jest.fn(),
}));
const { createEntry, updateEntry, deleteEntry } =
  await import("../services/entriesService.js");

test("createEntry rejects a missing title", async () => {
  const result = await createEntry({ title: "", body: "something" });
  expect(result.ok).toBe(false);
});

test("createEntry saves a valid entry and returns its DTO", async () => {
  const result = await createEntry({ title: "Groceries", body: "Milk, eggs" });
  expect(result.ok).toBe(true);
  expect(result.value).toEqual({
    id: "fake-id",
    title: "Groceries",
    body: "Milk, eggs",
  });
});

test("updateEntry returns an error if the entry does not exist", async () => {
  const result = await updateEntry("nonexistent-id", {
    title: "Updated",
    body: "Updated body",
  });
  expect(result.ok).toBe(false);
});

test("deleteEntry returns an error if the entry is invalid", async () => {
  const result = await deleteEntry("nonexistent-id");
  expect(result.ok).toBe(false);
});
