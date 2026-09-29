"use client";

import { useRef, useState } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import "./TruncatedText.css";

interface TruncatedTextProps {
    text: string;
    className?: string;
    as?: "span" | "p";
}

/**
 * One line of text that ends in "…" when it doesn't fit, and shows the full
 * text in a speech-bubble tooltip on hover — only when it is actually cut.
 * Screen readers always get the full text from the element itself.
 */
export default function TruncatedText({
    text,
    className = "",
    as: Tag = "span",
}: TruncatedTextProps) {
    const [open, setOpen] = useState(false);
    // Measured on hover, so the tooltip matches what is currently on screen.
    const isTruncated = useRef(false);
    const measure = (element: HTMLElement) => {
        isTruncated.current = element.scrollWidth > element.clientWidth;
    };

    return (
        <Tooltip.Provider delayDuration={150}>
            <Tooltip.Root
                open={open}
                onOpenChange={(next) => setOpen(next && isTruncated.current)}
            >
                <Tooltip.Trigger
                    asChild
                    onPointerEnter={(event) => measure(event.currentTarget)}
                >
                    <Tag className={`truncated-text ${className}`}>{text}</Tag>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content
                        className="truncated-text--tooltip"
                        side="top"
                        sideOffset={8}
                        collisionPadding={12}
                    >
                        {text}
                        <Tooltip.Arrow
                            className="truncated-text--arrow"
                            width={14}
                            height={7}
                        />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
}
