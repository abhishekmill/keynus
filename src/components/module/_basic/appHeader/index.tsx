"use client";
import React, { useEffect, useRef } from "react";
import { Link, usePathname } from "../../../../navigation";
import { useRouter } from "nextjs-toploader/app";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import Skeleton from "react-loading-skeleton";

import AppContainer from "@/components/module/_basic/container";
import BreadCrumb from "@/components/ui/breadcrumb";
import Button from "@/components/ui/button";
import Icon, { IconType } from "@/components/ui/Icon";
import TextInput from "@/components/ui/textInput";
import useDebounce from "@/utils/hooks/useDebounce";
import { useAppDispatch, useAppSelector } from "../../../../utils/hooks/store";
import { addCabinet, configuratorControlSelector } from "../../../../store/configuratorControl";

import styles from "./style.module.scss";

type Props = {
  heading?: string;
  hasPrev?: boolean;
  breadcrumb?: { label: string; href: string }[];
  navigation?: {
    type: "button" | "icon";
    href: string;
    label?: string;
    icon?: IconType;
  }[];
  hasSearch?: boolean;
  transText?: { [key: string]: string };
  isDeleteRedirectRedux?: boolean;
  type?: "default" | "loading";
};

const AppHeader: React.FC<Props> = ({
  heading,
  hasPrev = false,
  hasSearch = true,
  breadcrumb = [],
  navigation = [],
  transText = {},
  isDeleteRedirectRedux = false,
  type = "default",
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialSearchLoaded = useRef<boolean>(false);

  const { register, watch, reset } = useForm();
  const search = watch("search");

  const searchDebounce = useDebounce(search, 500);

  const { position } = useAppSelector(configuratorControlSelector);

  const onBack = () => {
    const positionStatus = position;
    if (isDeleteRedirectRedux) dispatch(addCabinet({ method: "reset", position: "none" }));
    if (positionStatus === "none") {
      router.push(breadcrumb?.[breadcrumb.length - 2]?.href ?? "/");
    } else {
      router.back();
    }
  };

  const handleNavigation = () => {
    if (isDeleteRedirectRedux) dispatch(addCabinet({ method: "reset", position: "none" }));
  };

  /**
   * Reset search
   */
  useEffect(() => {
    reset({
      search: searchParams.get("search") ?? "",
    });
  }, []);

  /**
   * Handle when search is changed
   */
  useEffect(() => {
    if (!initialSearchLoaded.current) {
      initialSearchLoaded.current = true;
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (searchDebounce) {
      params.set("search", searchDebounce);
      router.push(`${pathname}?${params?.toString()}`);
    } else if (searchParams.get("search") !== null) {
      params.delete("search");
      router.push(`${pathname}?${params?.toString()}`);
    }

    /** Redirect to new url */
    // if we use router.push() this position, it will be rerender when loading page
  }, [searchDebounce]);

  return (
    <div className={styles.wrapper}>
      <AppContainer className={styles.content}>
        <div>
          <div className={styles.backButtonWrapper}>
            <div className={styles.backButton}>
              {hasPrev && (
                <button onClick={() => onBack()} className={styles.button} aria-label="Back">
                  <Icon name="ArrowLeft" className={styles.icon} />
                </button>
              )}
              {heading}
            </div>
          </div>
          {type === "default" ? (
            breadcrumb?.length > 0 && <BreadCrumb className={styles.breadcrumb} links={breadcrumb} />
          ) : (
            <Skeleton />
          )}
        </div>
        {(navigation.length > 0 || hasSearch) && (
          <div className={styles.actions}>
            {navigation.map((item, idx) => (
              <Link
                href={item.href}
                key={idx}
                onClick={() => handleNavigation()}
                prefetch={item.icon === "ShoppingBag" ? true : false}
              >
                <Button label={item.label} icon={item.icon} className={styles.button} isPrefix />
              </Link>
            ))}
            {hasSearch && (
              <TextInput
                name="search"
                label={`${transText.searchHere}...`}
                icon="MagnifyingGlass"
                className={styles.search}
                register={register}
              />
            )}
          </div>
        )}
      </AppContainer>
    </div>
  );
};

export default AppHeader;
