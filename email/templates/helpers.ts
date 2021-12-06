import { format, parseISO } from "date-fns";
import { Nullable } from "typescript-nullable";
import { theme } from "../../stitches.config";
import { definitions } from "../../types/supabase";
import {
  bg,
  color,
  fontSize,
  globalStyles,
  join,
  margin,
  padding,
} from "./styles";

export function mail(content) {
  return body(header() + main(content) + footer());
}

export function logo() {
  return `<h1 style="${join(
    margin("0"),
    fontSize("6"),
    color("indigo9")
  )}">derkonzert <span style="${color("indigo12")}">munich</h1>`;
}

export function header() {
  return `<header style="${join(
    bg("indigo1"),
    padding("4", "0"),
    `box-shadow: 0 2px 9px ${theme.colors.blackA3};`,
    `border-bottom: 1px solid ${theme.colors.blackA2};`
  )}">${logo()}</header>`;
}

export function main(content) {
  return `<main style="${join(margin("4", "0"))}">${content}</main>`;
}

export function text(
  element: string,
  content: string,
  size: keyof typeof theme.fontSizes,
  textColor: keyof typeof theme.colors = "indigo12",
  fontWeight = "normal"
) {
  return `<${element} style="${join(
    fontSize(size),
    color(textColor),
    `font-weight: ${fontWeight}`
  )}">${content}</${element}>`;
}

export function footer() {
  return `<footer style="${join(
    padding("5", "0"),
    bg("indigo3"),
    color("slate9"),
    fontSize("2"),
    "text-align: center;"
  )}">You received this email because you have an account at ${link(
    "derkonzert.de",
    "https://derkonzert.de"
  )} — ${link(
    "Click here to manage your notifications",
    "https://derkonzert.de/account/profile/"
  )}</footer>`;
}

export function body(content) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"/><style><! — [if !mso]>
  <! — → <link href=”https://fonts.googleapis.com/css?family=IBM+Plex+Sans" rel=”stylesheet”>
  <! — <![endif] →${globalStyles()}</style></head><body>${content}</body></html>`;
}

export function link(text, target, col: keyof typeof theme.colors = "indigo9") {
  return `<a style="${join(
    color(col),
    "text-decoration: none;"
  )}" href="${target}">${text}</a>`;
}

export function list<T>(
  iteratable: T[],
  fn: (item: T, index: number) => string
) {
  return `<ul style="${join(margin("4", "0"), padding("0"))}">${iteratable
    .map(
      (item, index) =>
        `<li style="${join(
          "list-style: none;",
          margin("1", "0"),
          padding("1", "0"),
          index > 0 && `border-top: 1px solid ${theme.colors.indigo4.value};`
        )}">${fn(item, index)}</li>`
    )
    .join("")}</ul>`;
}

export function line() {
  return `<hr style="${join(
    "border: none;",
    `border-top: 2px solid ${theme.colors.indigo4.value};`,
    margin("7", "0")
  )}"/>`;
}

const parseAndFormat = (formatString) => {
  return (dateStringOrNull: Nullable<string>): string => {
    return Nullable.maybe(
      "Unknown Date",
      (dateString) => format(parseISO(dateString), formatString),
      dateStringOrNull
    );
  };
};

const dateAndTime = parseAndFormat("dd.MM.yyyy - HH:mm");

export function event(
  event: definitions["events"],
  size: "large" | "normal" = "normal"
) {
  return link(
    [
      `<p style="${join(
        margin("2", "0"),
        fontSize(size === "large" ? "7" : "5"),
        color(size === "large" ? "indigo12" : "indigo12"),
        "font-weight: bold;"
      )}">${event.title}<br/>`,
      `<span style="${join(
        fontSize("4"),
        "font-weight: normal;",
        color("indigo10")
      )}">${dateAndTime(event.fromDate)}</span></p>`,
    ].join(""),
    `https://derkonzert.de/event/${event.id}`,
    "indigo12"
  );
}

export function feedback(feedback: definitions["feedback"]) {
  return `<p style="${join(
    margin("2", "0"),
    fontSize("7"),
    color("indigo12"),
    "text-align: center;",
    "font-weight: bold;"
  )}">${feedback?.mood ?? ""}<br/>${feedback?.content ?? ""}`;
}

export function button(text, href) {
  return `<a href=${href} style="${join(
    bg("indigo10"),
    color("indigo1"),
    padding("4"),
    margin("6", "auto"),
    fontSize("4"),
    "display: inline-block;",
    "text-decoration: none;",
    "border-radius: 4px;",
    "font-weight: bold;"
  )}">${text}</a>`;
}

export function center(content) {
  return `<div style="text-align: center;">${content}</div>`;
}

export function conditional(condition, ...content) {
  return condition ? join(...content) : "";
}
