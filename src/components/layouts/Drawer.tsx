"use client";

import { NEWS_SOURCE } from "@/lib/common/constants";
import { setFromDate, setSourceEnabled, setToDate } from "@/lib/features/combinedNews/combinedNewsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {  Alert, Button, Checkbox, Datepicker, Drawer, Label } from "flowbite-react";
import { ChangeEventHandler, useState } from "react";
import { HiAdjustments } from "react-icons/hi";
import { sub } from "date-fns";

interface DrawerProps {
    isOpen: boolean;
    handleClose: () => void;
    onSave: () => void;
}

export function HeaderDrawer(props: DrawerProps) {
  const {isOpen, handleClose, onSave} = props;
  const [fromDate, setStateFromDate] = useState<Date>(new Date());
  const [toDate, setStateToDate] = useState<Date>(new Date());
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
    dispatch(setFromDate(fromDate.toISOString()));
    dispatch(setToDate(toDate.toISOString()));
    console.log(sourceOptionMapping)
    sourceOptions.forEach((source) => {
        dispatch(setSourceEnabled({source: NEWS_SOURCE[source], enabled: sourceOptionMapping[source]}));
    });
    onSave();
  }

  const onChangeDate = (key:string, date: Date) =>{
    switch(key){
        case 'from':
            setStateFromDate(date);
            break;
        case 'to':
          setStateToDate(date);
            break;
    }
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
              <Datepicker defaultDate={sub(new Date(), {months: 6})} onSelectedDateChanged={(date:Date)=>onChangeDate('from', date)}/>
            </div>
            <div className="mb-6">
              <Label htmlFor="title" className="mb-2 block">
                Date to
              </Label>
              <Datepicker onSelectedDateChanged={(date:Date)=>onChangeDate('to', date)}/>
            </div>
            <div className="my-4">
              <Alert color="warning" withBorderAccent>
                <span>
                  <span className="font-medium">Warning!</span> Some of API in certain case (i.e Headlines) doesn't support filter by date, categories, etc.
                </span>
              </Alert>
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
