'use client';
import { HeaderDrawer } from "./Drawer";
import { useState } from "react";
import { HiAdjustments, HiOutlineSearch } from "react-icons/hi";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/hooks";
import { setFromDate } from "@/lib/features/combinedNews/combinedNewsSlice";
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
  )

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
                <nav className={'header-nav'}>
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
            <Modal show={openModalSearch} onClose={() => setOpenModalSearch(false)}>
              <Modal.Body>
                <div className="space-y-6">
                      {TextInputComponent}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={() => searchNews()}>Search</Button>
              </Modal.Footer>
            </Modal>
        </header>
    )
}