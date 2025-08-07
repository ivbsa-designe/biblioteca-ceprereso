# Tauri + Vanilla TS

This template should help get you started developing with Tauri in vanilla HTML, CSS and Typescript.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

Ejemplo de paleta y diseño:
/* From Uiverse.io by MijailVillegas */ 
.card {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bolder;
  color: hsla(0, 0%, 0%, 0.3);
  z-index: 1;
  width: 280px;
  height: 400px;
  display: grid;
  justify-items: center;
  align-items: center;
  align-content: space-around;
  text-align: center;
  grid-template-rows: 0.25fr 0.5fr 0.25fr;
  padding: 1em;
  border-radius: 3em;
  border: solid 0.5em #fafafa;
  background: #fafafa;
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuZGV2L3N2Z2pzIiB2aWV3Qm94PSIwIDAgMjQwMCA4MDAiIG9wYWNpdHk9IjAuODgiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCB4MT0iNTAlIiB5MT0iMCUiIHgyPSI1MCUiIHkyPSIxMDAlIiBpZD0ic3NzdXJmLWdyYWQiPjxzdG9wIHN0b3AtY29sb3I9ImhzbGEoMTc0LCA3NyUsIDUwJSwgMS4wMCkiIHN0b3Atb3BhY2l0eT0iMSIgb2Zmc2V0PSIwJSI+PC9zdG9wPjxzdG9wIHN0b3AtY29sb3I9ImhzbGEoMTc0LCA3NyUsIDgwJSwgMC4yOSkiIHN0b3Atb3BhY2l0eT0iMSIgb2Zmc2V0PSIxMDAlIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgZmlsbD0idXJsKCNzc3N1cmYtZ3JhZCkiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMCwtODguNTg3MjQ5NzU1ODU5MzgpIj48cGF0aCBkPSJNIDAgMjkyLjE4MDc4ODA0ODE2NzYgUSA2MDAgNjA5Ljg4OTY2NjQwOTY4NTIgODAwIDI5MC4xNzQ1MDY0NTIzMDIxIFEgMTQwMCA2MzMuODIzNjQ1MDgwOTAxMyAxNjAwIDMxMi45MTEwMzE2MDA3MTgzMyBRIDIyMDAgNTU2LjA5OTYxNDc2MzY4NjEgMjQwMCAzMzcuNzE2MTYyODQ1MjExMSBMIDI0MDAgODAwIEwgMCA4MDAgTCAwIDM0OC40OTg2MjAwNDgzMjYyNSBaIiB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLDAsNDEpIiBvcGFjaXR5PSIwLjA1Ij48L3BhdGg+PHBhdGggZD0iTSAwIDI5Mi4xODA3ODgwNDgxNjc2IFEgNjAwIDYwOS44ODk2NjY0MDk2ODUyIDgwMCAyOTAuMTc0NTA2NDUyMzAyMSBRIDE0MDAgNjMzLjgyMzY0NTA4MDkwMTMgMTYwMCAzMTIuOTExMDMxNjAwNzE4MzMgUSAyMjAwIDU1Ni4wOTk2MTQ3NjM2ODYxIDI0MDAgMzM3LjcxNjE2Mjg0NTIxMTEgTCAyNDAwIDgwMCBMIDAgODAwIEwgMCAzNDguNDk4NjIwMDQ4MzI2MjUgWiIgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwwLDgyKSIgb3BhY2l0eT0iMC4yNCI+PC9wYXRoPjxwYXRoIGQ9Ik0gMCAyOTIuMTgwNzg4MDQ4MTY3NiBRIDYwMCA2MDkuODg5NjY2NDA5Njg1MiA4MDAgMjkwLjE3NDUwNjQ1MjMwMjEgUSAxNDAwIDYzMy44MjM2NDUwODA5MDEzIDE2MDAgMzEyLjkxMTAzMTYwMDcxODMzIFEgMjIwMCA1NTYuMDk5NjE0NzYzNjg2MSAyNDAwIDMzNy43MTYxNjI4NDUyMTExIEwgMjQwMCA4MDAgTCAwIDgwMCBMIDAgMzQ4LjQ5ODYyMDA0ODMyNjI1IFoiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMCwxMjMpIiBvcGFjaXR5PSIwLjQzIj48L3BhdGg+PHBhdGggZD0iTSAwIDI5Mi4xODA3ODgwNDgxNjc2IFEgNjAwIDYwOS44ODk2NjY0MDk2ODUyIDgwMCAyOTAuMTc0NTA2NDUyMzAyMSBRIDE0MDAgNjMzLjgyMzY0NTA4MDkwMTMgMTYwMCAzMTIuOTExMDMxNjAwNzE4MzMgUSAyMjAwIDU1Ni4wOTk2MTQ3NjM2ODYxIDI0MDAgMzM3LjcxNjE2Mjg0NTIxMTEgTCAyNDAwIDgwMCBMIDAgODAwIEwgMCAzNDguNDk4NjIwMDQ4MzI2MjUgWiIgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsMSwwLDE2NCkiIG9wYWNpdHk9IjAuNjIiPjwvcGF0aD48cGF0aCBkPSJNIDAgMjkyLjE4MDc4ODA0ODE2NzYgUSA2MDAgNjA5Ljg4OTY2NjQwOTY4NTIgODAwIDI5MC4xNzQ1MDY0NTIzMDIxIFEgMTQwMCA2MzMuODIzNjQ1MDgwOTAxMyAxNjAwIDMxMi45MTEwMzE2MDA3MTgzMyBRIDIyMDAgNTU2LjA5OTYxNDc2MzY4NjEgMjQwMCAzMzcuNzE2MTYyODQ1MjExMSBMIDI0MDAgODAwIEwgMCA4MDAgTCAwIDM0OC40OTg2MjAwNDgzMjYyNSBaIiB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLDAsMjA1KSIgb3BhY2l0eT0iMC44MSI+PC9wYXRoPjxwYXRoIGQ9Ik0gMCAyOTIuMTgwNzg4MDQ4MTY3NiBRIDYwMCA2MDkuODg5NjY2NDA5Njg1MiA4MDAgMjkwLjE3NDUwNjQ1MjMwMjEgUSAxNDAwIDYzMy44MjM2NDUwODA5MDEzIDE2MDAgMzEyLjkxMTAzMTYwMDcxODMzIFEgMjIwMCA1NTYuMDk5NjE0NzYzNjg2MSAyNDAwIDMzNy43MTYxNjI4NDUyMTExIEwgMjQwMCA4MDAgTCAwIDgwMCBMIDAgMzQ4LjQ5ODYyMDA0ODMyNjI1IFoiIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLDEsMCwyNDYpIiBvcGFjaXR5PSIxLjAwIj48L3BhdGg+PC9nPjwvc3ZnPg==");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: revert;
  box-shadow: 5px 5px 7px hsla(0, 0%, 84%, 0.447), -3px -4px 7px rgba(255, 255, 255, 0.3843137255);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: background-position 1s ease-in;
  animation: blinkShadowsFilter 8s ease-in infinite;
}

.card .heading {
  align-self: baseline;
  display: grid;
  letter-spacing: 3px;
}

.card .heading span {
  -webkit-background-clip: text;
  background-clip: text;
  color: #afafaf;
  background-color: transparent;
  transition: all 1s ease-in;
  transform: translateY(-20%);
  text-align: center;
  font-size: 3.5em;
}

.card button {
  align-self: flex-end;
  font-size: 1em;
  border-style: none;
  padding: 1em;
  border-radius: 5em;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  font-weight: bolder;
  text-shadow: 3px 3px 5px #48beb3, -3px -3px 5px #68ffff;
  color: #e0fff8;
  background: #12a597;
  background: linear-gradient(145deg, #5ef8e9, #4fd1c4);
  box-shadow: 3px 3px 5px #48beb3, -3px -3px 5px #68ffff;
}

.card button:active {
  background: #57e9db;
  box-shadow: inset 3px 3px 5px #47bfb4, inset -3px -3px 5px #67ffff;
}

.card button:hover {
  cursor: pointer;
}

.card:hover {
  background-position: right;
}

.card:hover .heading span {
  background-repeat: no-repeat;
  background-size: cover;
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuZGV2L3N2Z2pzIiB2aWV3Qm94PSIwIDAgODAwIDgwMCI+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJjY2NpcmN1bGFyLWdyYWQiIHI9IjUwJSIgY3g9IjUwJSIgY3k9IjUwJSI+CiAgICAgICAgIDxzdG9wIG9mZnNldD0iMTUlIiBzdG9wLWNvbG9yPSIjYWMzZDAwIiBzdG9wLW9wYWNpdHk9IjAuNSI+PC9zdG9wPgogICAgICAgICA8c3RvcCBvZmZzZXQ9Ijc1JSIgc3RvcC1jb2xvcj0iaHNsKDI1LCA4MyUsIDQ5JSkiIHN0b3Atb3BhY2l0eT0iMSI+PC9zdG9wPgogICAgICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZjZTc4IiBzdG9wLW9wYWNpdHk9IjEiPjwvc3RvcD4KICAgICAgICA8L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJ1cmwoI2NjY2lyY3VsYXItZ3JhZCkiPjxjaXJjbGUgcj0iNjQzLjUiIGN4PSI0MDAiIGN5PSI0MDAiPjwvY2lyY2xlPjxjaXJjbGUgcj0iNTg1IiBjeD0iNDAwIiBjeT0iNDAwIj48L2NpcmNsZT48Y2lyY2xlIHI9IjUyNi41IiBjeD0iNDAwIiBjeT0iNDAwIj48L2NpcmNsZT48Y2lyY2xlIHI9IjQ2OCIgY3g9IjQwMCIgY3k9IjQwMCI+PC9jaXJjbGU+PGNpcmNsZSByPSI0MDkuNSIgY3g9IjQwMCIgY3k9IjQwMCI+PC9jaXJjbGU+PGNpcmNsZSByPSIzNTEiIGN4PSI0MDAiIGN5PSI0MDAiPjwvY2lyY2xlPjxjaXJjbGUgcj0iMjkyLjUiIGN4PSI0MDAiIGN5PSI0MDAiPjwvY2lyY2xlPjxjaXJjbGUgcj0iMjM0IiBjeD0iNDAwIiBjeT0iNDAwIj48L2NpcmNsZT48Y2lyY2xlIHI9IjE3NS41IiBjeD0iNDAwIiBjeT0iNDAwIj48L2NpcmNsZT48Y2lyY2xlIHI9IjExNyIgY3g9IjQwMCIgY3k9IjQwMCI+PC9jaXJjbGU+PC9nPjwvc3ZnPg==");
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 1s ease-in;
}

.content .item {
  width: -moz-fit-content;
  width: fit-content;
  display: flex;
  gap: 1em;
  align-items: center;
  transition: all 0.8s ease-in-out;
}

.content .item span {
  transition: all 0.5s ease-in;
  width: 0%;
  background: transparent;
  font-size: 1.2em;
}

.content .item--create {
  transition: all 0.8s ease-in-out;
  transform: translateX(100%);
}

.content .item--post {
  transition: all 0.8s ease-in-out;
  transform: translateX(80%);
}

.content .item--inspire {
  transition: all 0.8s ease-in-out;
  transform: translateX(20%);
}

.content .item--inspire svg {
  box-shadow: 4px 4px 7px #47bfb4, -4px -4px 7px #67ffff;
}

.content svg {
  border-radius: 1em;
  width: 2.5em;
  height: 2.5em;
  padding: 0.5em;
  background: #fafafa;
  box-shadow: 4px 4px 7px #d5d5d5, -4px -4px 7px #ffffff;
}

.content:hover .item {
  padding-left: 2em;
}

.content:hover .item--create {
  transform: translateX(20%);
}

.content:hover .item--post {
  transform: translateX(20%);
}

.content:hover .item--inspire {
  transform: translateX(20%);
}

.item:hover {
  gap: 2em;
  color: hsl(19, 78%, 65%);
  cursor: pointer;
}

.item:hover span {
  letter-spacing: 2px;
  padding-inline: 1rem;
  border-radius: 1em;
  color: rgba(0, 0, 0, 0.6);
}

.item:hover svg {
  box-shadow: inset 4px 4px 7px #d5d5d5, inset -4px -4px 7px #ffffff;
}

@keyframes blinkShadowsFilter {
  0% {
    filter: drop-shadow(23px 12px 28px hsla(218, 87%, 88%, 0.3)) drop-shadow(-20px -18px 28px hsla(171, 80%, 73%, 0.3));
  }

  25% {
    filter: drop-shadow(23px -12px 24px hsla(218, 87%, 88%, 0.3)) drop-shadow(-20px 18px 24px hsla(171, 100%, 93%, 0.3));
  }

  50% {
    filter: drop-shadow(23px 12px 30px hsla(218, 100%, 88%, 0.3)) drop-shadow(-20px 18px 30px hsla(171, 95%, 83%, 0.3));
  }

  75% {
    filter: drop-shadow(20px -18px 25px hsla(218, 87%, 88%, 0.3)) drop-shadow(-20px 20px 25px hsla(171, 100%, 80%, 0.3));
  }

  to {
    filter: drop-shadow(23px 12px 28px hsla(218, 87%, 88%, 0.3)) drop-shadow(-20px -18px 28px hsla(171, 80%, 73%, 0.3));
  }
}