"use client";

import { NEWS_SOURCE } from "@/lib/common/constants";
import { setSourceEnabled } from "@/lib/features/combinedNews/combinedNewsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {  Button, Checkbox, Datepicker, Drawer, Label } from "flowbite-react";
import { useState } from "react";
import { HiAdjustments } from "react-icons/hi";

interface DrawerProps {
    isOpen: boolean;
    handleClose: () => void;
    onSave: () => void;
}

export function HeaderDrawer(props: DrawerProps) {
  const {isOpen, handleClose, onSave} = props;
  const dispatch = useAppDispatch();
  const sourceOptions = Object.keys(NEWS_SOURCE);

  const newsApiEnabled = useAppSelector((state) => state.combinedNews.newsApiEnabled);
  const guardianEnabled = useAppSelector((state) => state.combinedNews.guardianEnabled);
  const newYorkTimesEnabled = useAppSelector((state) => state.combinedNews.newYorkTimesEnabled);

  const [sourceOptionMapping, setSourceOptionMapping] = useState<Record<string, boolean>>({
    NEWS_API: newsApiEnabled,
    GUARDIAN: guardianEnabled,
    NEW_YORK_TIMES: newYorkTimesEnabled
  });


    const onChangeSources = (source:string) => {
        setSourceOptionMapping({
            ...sourceOptionMapping,
            [source]: !sourceOptionMapping[source]
        });
        // dispatch(setSourceEnabled({source, enabled: !sourceOptionMapping[source]}));
    }

  const onCloseDrawer = () => {
    setSourceOptionMapping({
        NEWS_API: newsApiEnabled,
        GUARDIAN: guardianEnabled,
        NEW_YORK_TIMES: newYorkTimesEnabled
    });
    handleClose();
  }  

  const onSaveClick = () => {
    onSave();
  }

  return (
    <>
      <Drawer open={isOpen} onClose={onCloseDrawer} position="right">
        <Drawer.Header title="Filter" titleIcon={HiAdjustments} />
        <Drawer.Items>
          <form action="#">
            <div className="mb-6 mt-3">
              <Label htmlFor="title" className="mb-2 block">
                Sources
              </Label>
              <div>
                {
                    sourceOptions.map((source) => (
                        <div key={source} className="flex items-center gap-2">
                            <Checkbox id={source} checked={sourceOptionMapping[source]} onChange={()=>onChangeSources(source)}/>
                            <Label htmlFor={source}>{NEWS_SOURCE[source]}</Label>
                        </div>
                    ))
                }
              </div>
            </div>
            <div className="mb-6">
              <Label htmlFor="title" className="mb-2 block">
                Date from
              </Label>
              <Datepicker />
            </div>
            <div className="mb-6">
              <Label htmlFor="title" className="mb-2 block">
                Date to
              </Label>
              <Datepicker />
            </div>
            <Button className="w-full" onClick={onSaveClick}>
              {/* <HiCalendar className="mr-2" /> */}
              Save
            </Button>
          </form>
        </Drawer.Items>
      </Drawer>
    </>
  );
}
