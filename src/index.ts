import { Elysia } from "elysia";
import { html } from "@elysiajs/html"

const file = Bun.file("src/log.txt")
let fileAsString = await file.text()
let lines = fileAsString.split("\n")

let doc

for(let line in lines) {
  let tempLine = lines[line]
  // seperating each line into time, level, screen and message
  let tempLine_split = tempLine.split(/^\[(?<time>\d\d[:\.]\d\d[:\.]\d\d) (?<level>[a-z]+)(?: +screen_(?<screen>\d+))? +(?<modName>[^\]]+)\]/i)
  
  let time = tempLine_split[1]
  let level = tempLine_split[2]
  let screen = tempLine_split[3]
  let message = tempLine_split[4]

  console.log(tempLine_split)


  
  lines[line] = tempLine
}

let combinedLines = lines.join("<br />")

const app = new Elysia().use(html()).get("/", () =>`
<html lang="en">
  <head>
      <title>Log Parser</title>
  </head>
  <body>` 
    + combinedLines +
  `</body>
</html>`

).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);