
// https://mui.com/components/cards/#api
export const CardSlot = {
  header: {
    action: "MuiCardHeader-action",
  },
}

export function select(slot: string): string{
  /*
  - `&` is a non-standard selector that specifies the name of the parent CSS 
    class (generated by MUI for component you're attaching the style to)
  - ` ` is the standard CSS "nested within" selector
  = `.` is the standard CSS "class" selector
   */
  return `& .${slot}`
}
