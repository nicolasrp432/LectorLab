import assert from "node:assert/strict";
import { skills, books, gadgets, course, getProduct, getSkill, skillsOf, amazonUrl, productUrl } from "../src/data/catalog.js";

// Test skills integrity
assert.ok(skills.length >= 7, "Skills array should have at least 7 skills");
for (const s of skills) {
  assert.ok(s.slug, "Skill must have slug");
  assert.ok(s.name, "Skill must have name");
  assert.ok(Array.isArray(s.books) && s.books.length > 0, `Skill ${s.slug} must have books`);
  for (const bId of s.books) {
    const prod = getProduct(bId);
    assert.ok(prod, `Book ${bId} referenced in skill ${s.slug} must exist in catalog`);
    assert.equal(prod.type, "book");
  }
}

// Test books integrity
assert.ok(books.length > 0, "Books array not empty");
for (const b of books) {
  assert.ok(b.id, "Book must have id");
  assert.ok(b.title, "Book must have title");
  assert.ok(b.author, "Book must have author");
  const url = productUrl(b);
  assert.ok(url.startsWith("https://www.amazon.es/"), "Book URL should point to Amazon");
}

// Test gadgets integrity
assert.ok(gadgets.length > 0, "Gadgets array not empty");
for (const g of gadgets) {
  assert.ok(g.id, "Gadget must have id");
  assert.ok(g.title, "Gadget must have title");
  assert.ok(g.image, "Gadget must have image");
  const url = productUrl(g);
  assert.ok(url.startsWith("https://www.amazon.es/"), "Gadget URL should point to Amazon");
}

// Test course integrity
assert.ok(course.slug, "Course must have slug");
assert.equal(course.type, "course");
assert.ok(course.modules.length > 0, "Course has modules");
assert.equal(productUrl(course), `/tienda/${course.slug}/`);

// Test skillsOf
assert.deepEqual(skillsOf("curso-lectura-rapida"), ["leer-mejor"]);
const habitosSkills = skillsOf("habitos-atomicos");
assert.ok(habitosSkills.includes("foco-y-habitos"), "Habitos atomicos should be mapped to foco-y-habitos");

console.log("PASS: catalog data integrity, relations, productUrl and skills mappings validated.");
