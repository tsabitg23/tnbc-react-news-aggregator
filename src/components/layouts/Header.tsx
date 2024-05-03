'use client';
import { HeaderDrawer } from "./Drawer";
import React, { useState } from "react";
import { HiAdjustments, HiOutlineSearch } from "react-icons/hi";
import { Button, Label, MegaMenu, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import CategoryDropDown, { DropDownOption } from "./NavBar/CategoryDropDown";
import { NEWS_API_CATEGORY, NEWS_API_CATEGORY_ICONS, NEWS_SOURCE } from "@/lib/common/constants";
import { HiPresentationChartLine, HiSparkles, HiNewspaper, HiHeart, HiOutlineCubeTransparent, HiOutlineDesktopComputer } from "react-icons/hi";
export default function Header(){
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openModalSearch, setOpenModalSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const handleClose = () => setIsDrawerOpen(false);
  const openDrawer = () => setIsDrawerOpen(true);
  const onSave = () => {
    handleClose();
  }

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      searchNews();
    }
  }

  const searchNews = () => {
    router.push(`/search/${searchValue}`);
    setOpenModalSearch(false);
  }

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }

  const goBackHome = () => {
    router.push('/');
  }

  const onClickSearch = () => {
    setOpenModalSearch(!openModalSearch);
  }

  const TextInputComponent = (
    <TextInput 
      id="search-news" 
      icon={HiOutlineSearch} 
      placeholder="Search ..." 
      required 
      value={searchValue}
      onChange={onChangeSearch} 
      onKeyDown={handleSearchKeyPress}/>
  );


  const newsApiDropdown:DropDownOption[] = NEWS_API_CATEGORY.map((category, index) => {
    return {
      title: category,
      icon: React.createElement(NEWS_API_CATEGORY_ICONS[index], {className: 'mr-1'}),
      target: `/news_api/${category}`
    }
  });

    return (
        <header className={'header'}>
            <HeaderDrawer isOpen={isDrawerOpen} handleClose={handleClose} onSave={onSave}/>
            <div className={'header-container'}>
                <div className="flex flex-row">
                    <h1 onClick={goBackHome} className={'header-title text-primary cursor-pointer'}>NewsFlash</h1>
                    <div className="max-w-md ml-8 hidden md:flex">
                        {TextInputComponent}
                    </div>
                </div>
                  <nav className={'header-nav flex flex-row'}>
                    <CategoryDropDown title={NEWS_SOURCE.NEWS_API} dropdowns={newsApiDropdown}/>
                    <ul>
                        <li className="flex flex-row justify-center items-center md:hidden" onClick={onClickSearch}>
                          <HiOutlineSearch />
                          <span className="ml-2">Search</span>
                        </li>
                        <li className="flex flex-row justify-center items-center" onClick={openDrawer}>
                            <HiAdjustments />
                            <span className="ml-2">Filter</span>
                        </li>
                    </ul>
                  </nav>
            </div>
            <Modal open={openModalSearch} showCloseIcon={false} onClose={()=>setOpenModalSearch(false)} center>
              <div className="flex flex-col">
                {TextInputComponent}
                <Button onClick={()=>searchNews()} className="mt-4">Search</Button>
              </div>
            </Modal>
        </header>
    )
}