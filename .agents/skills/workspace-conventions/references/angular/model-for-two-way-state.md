# Use `model` for state a component both reads and updates

## Instructions

- In Angular components, when a value is passed in by the parent and the component itself changes it, declare it with `model()` / `model.required()`.
- Never pair an `input()` with a manually named `<name>Change` `output()` to emulate two-way binding.
- Update it with `.set()` / `.update()`; the `<name>Change` output is generated automatically.

## Examples

Before: `offset = input.required<number>(); offsetChange = output<number>();` with `offsetChange.emit(offset() + limit())`.

After: `offset = model.required<number>();` with `offset.set(offset() + limit())`.
