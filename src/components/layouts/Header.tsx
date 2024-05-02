'use client';
import { HeaderDrawer } from "./Drawer";
import { useState } from "react";
import { HiAdjustments, HiOutlineSearch } from "react-icons/hi";
import { Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
export default function Header(){
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const handleClose = () => setIsOpen(false);
  const openDrawer = () => setIsOpen(true);
  const onSave = () => {
    handleClose();
  }

  const handleSearchKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if(event.key === 'Enter'){
      router.push(`/search/${searchValue}`);
    }
  }

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }

  const goBackHome = () => {
    router.push('/');
  }

    return (
        <header className={'header'}>
            <HeaderDrawer isOpen={isOpen} handleClose={handleClose} onSave={onSave}/>
            <div className={'header-container'}>
                <div className="flex flex-row">
                    <h1 onClick={goBackHome} className={'header-title text-primary cursor-pointer'}>NewsFlash</h1>
                    <div className="max-w-md ml-8">
                        <TextInput 
                            id="search-news" 
                            icon={HiOutlineSearch} 
                            placeholder="Search ..." 
                            required 
                            value={searchValue}
                            onChange={onChangeSearch} 
                            onKeyDown={handleSearchKeyPress}/>
                    </div>
                </div>
                <nav className={'header-nav'}>
                <ul>
                    <li className="flex flex-row justify-center items-center" onClick={openDrawer}>
                        <HiAdjustments />
                        <span className="ml-2">Filter</span>
                    </li>
                </ul>
                </nav>
            </div>
        </header>
    )
}