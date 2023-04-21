declare module '*.sass'
declare module '*.webp'
declare module '*.svg'
declare module "jsx:*.svg" {
  import { ComponentType, SVGProps } from "react";
  const SVGComponent: ComponentType<SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}

declare type Children = { children?: JSX.Element | JSX.Element[] }