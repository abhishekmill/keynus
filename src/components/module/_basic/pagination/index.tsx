"use client";
import React, { Fragment, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import classNames from "classnames";
import { useRouter } from "nextjs-toploader/app";
import { Listbox, Transition } from "@headlessui/react";
import { useSearchParams } from "next/navigation";

import Icon from "../../../ui/Icon";
import { usePathname } from "../../../../navigation";

import styles from "./style.module.scss";

type Props = {
  length: number;
  transText: { [key: string]: string };
};

const Pagination: React.FC<Props> = ({ length, transText }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState(10);
  const [pageCount, setPageCount] = useState(Math.ceil(length / 10));
  const [defaultActive, setDefaultActive] = useState(0);
  const searchParamPage = searchParams.get("page");

  useEffect(() => {
    setSelected(+(searchParams.get("limit") ?? "10"));
    setPageCount(Math.ceil(length / +(searchParams.get("limit") ?? "10")));
    setDefaultActive(+(searchParams.get("page") ?? "1") - 1);
  }, [length]);

  useEffect(() => {
    setDefaultActive(+(searchParamPage ?? "1") - 1);
  }, [searchParamPage]);

  /**
   * Handle page click
   * @param event Params from ReactPaginate
   */
  const handlePageClick = (event: any) => {
    const params = new URLSearchParams(searchParams);
    if (event.selected) {
      params.set("page", event.selected + 1);
    } else {
      params.delete("page");
    }

    /** Redirect to new url */
    router.push(`${pathname}?${params?.toString()}`);
  };

  /**
   * Handle item per page
   * @param itemPerPage Item per page
   */
  const handleItemPerPage = (itemPerPage: number) => {
    /** Reset properties when click items per page */
    setSelected(itemPerPage);
    setPageCount(Math.ceil(length / itemPerPage));
    setDefaultActive(0);

    const params = new URLSearchParams(searchParams);
    params.delete("page");

    if (itemPerPage) {
      params.set("limit", `${itemPerPage}`);
    } else {
      params.delete("limit");
    }

    /** Redirect to new url */
    router.push(`${pathname}?${params?.toString()}`);
  };

  return (
    !!pageCount && (
      <div className={styles.wrapper}>
        <ReactPaginate
          breakLabel="..."
          nextLabel={
            <button aria-label="Next">
              <Icon name="ChevronDown" className={styles.rightIcon} />
            </button>
          }
          forcePage={defaultActive}
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          pageCount={pageCount}
          previousLabel={
            <button aria-label="Previous">
              <Icon name="ChevronDown" className={styles.leftIcon} />
            </button>
          }
          pageLinkClassName={styles.link}
          activeLinkClassName={styles.active}
          nextLinkClassName={styles.next}
          previousLinkClassName={styles.prev}
          containerClassName={styles.container}
          breakClassName={styles.breaker}
          renderOnZeroPageCount={null}
        />
        <Listbox value={selected} onChange={handleItemPerPage}>
          <div className={styles.content}>
            <Listbox.Button className={styles.button}>
              <span className={styles.label}>
                {selected} {transText.itemsPerPage}
              </span>
              <span className={styles.iconWrapper}>
                <Icon name="ChevronDown" className={styles.icon} />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={styles.options}>
                {[10, 25, 50].map((item, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      classNames(active ? "bg-primary text-white" : "text-gray-900", styles.option)
                    }
                    value={item}
                  >
                    {item}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
    )
  );
};

export default Pagination;
