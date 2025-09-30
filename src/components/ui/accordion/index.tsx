import React, { ReactNode } from "react";
import { Accordion, AccordionItem as Item } from "@szhsin/react-accordion";

import Icon from "../Icon";

import styles from "./style.module.scss";

type AccordionProps = {
  items: {
    header: ReactNode;
    content: ReactNode;
  }[];
  allowMultiple?: boolean;
  expandAll?: boolean;
};

type AccordionItemProps = {
  header: ReactNode;
  children: ReactNode;
  initialEntered: boolean;
};

export const AccordionItem: React.FC<AccordionItemProps> = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={
      <>
        {header}
        <Icon name="ChevronDown" className={styles.chevron} />
      </>
    }
    className={styles.item}
    buttonProps={{
      className: ({ isEnter }) => `${styles.itemBtn} ${isEnter && styles.itemBtnExpanded}`,
    }}
    contentProps={{ className: styles.itemContent }}
    panelProps={{ className: styles.itemPanel }}
  />
);

const CustomAccordion: React.FC<AccordionProps> = ({ items, allowMultiple, expandAll }) => {
  return (
    <>
      <Accordion allowMultiple={allowMultiple} defaultChecked transition transitionTimeout={250} className="space-y-10">
        {items.map((item, index) => (
          <AccordionItem key={index} header={item.header} initialEntered={expandAll ?? false}>
            {item.content}
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
};

export default CustomAccordion;
