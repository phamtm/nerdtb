'use client';

import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

type Dimension = `${number}${string}` | number;

type FlexProps = {
  readonly direction?: CSSProperties["flexDirection"];
  readonly align?: CSSProperties["alignItems"];
  readonly justify?: CSSProperties["justifyContent"];
  readonly gap?: Dimension;
  readonly wrap?: boolean;
  readonly fullWidth?: boolean;
  readonly fullHeight?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "style"> & {
    readonly style?: Omit<CSSProperties, "display" | "flexDirection">;
  };

const dimensionValue = (value?: Dimension) => {
  if (value === undefined) {
    return undefined;
  }
  return typeof value === "number" ? `${value}px` : value;
};

// The layout primitives expose tiny flexbox wrappers so other components can
// compose layouts declaratively (e.g., Row/Col/Spacer) without duplicating CSS.
export const Flex = forwardRef<HTMLDivElement, FlexProps>(function Flex(
  {
    direction = "row",
    align,
    justify,
    gap,
    wrap = false,
    fullWidth = false,
    fullHeight = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  const computedStyle: CSSProperties = {
    display: "flex",
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap: dimensionValue(gap),
    flexWrap: wrap ? "wrap" : undefined,
    width: fullWidth ? "100%" : undefined,
    height: fullHeight ? "100%" : undefined,
    ...style,
  };

  return (
    <div ref={ref} className={className} style={computedStyle} {...rest} />
  );
});

type RowProps = Omit<FlexProps, "direction">;

export const Row = forwardRef<HTMLDivElement, RowProps>(function Row(
  props,
  ref,
) {
  return <Flex ref={ref} direction="row" {...props} />;
});

type ColProps = Omit<FlexProps, "direction">;

export const Col = forwardRef<HTMLDivElement, ColProps>(function Col(
  props,
  ref,
) {
  return <Flex ref={ref} direction="column" {...props} />;
});

type StackProps = {
  readonly children: ReactNode;
  readonly gap?: Dimension;
  readonly align?: CSSProperties["alignItems"];
} & Omit<HTMLAttributes<HTMLDivElement>, "children">;

export const Stack = forwardRef<HTMLDivElement, StackProps>(function Stack(
  { children, gap = 12, align = "stretch", ...rest },
  ref,
) {
  return (
    <Col ref={ref} gap={gap} align={align} {...rest}>
      {children}
    </Col>
  );
});

type SpacerProps = {
  readonly min?: Dimension;
  readonly direction?: "horizontal" | "vertical";
} & HTMLAttributes<HTMLDivElement>;

export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  function Spacer({ min, direction = "horizontal", style, ...rest }, ref) {
    const computedStyle: CSSProperties = {
      flexShrink: 0,
      flexBasis: min ? dimensionValue(min) : undefined,
      width: direction === "vertical" ? "100%" : undefined,
      height: direction === "horizontal" ? "100%" : undefined,
      ...style,
    };
    return <div ref={ref} style={computedStyle} {...rest} />;
  },
);
