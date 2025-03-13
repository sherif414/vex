import { describe, expect, it } from "vitest"
import { useID } from "../id"

describe("useID", () => {
  it("returns an id string when called", () => {
    const id = useID()
    expect(typeof id).toBe("string")
    expect(id).toBeTruthy()
  })

  // ----------------------------------------------------------------------------------------------------

  it("returns a unique id for every call", () => {
    const ids = new Set()
    for (let i = 0; i < 100; i++) {
      ids.add(useID())
    }
  })
})
