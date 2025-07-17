import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"



export default function DoctorsList() {



  return (
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem><Link href="/">Home</Link></CommandItem>
          <CommandItem><Link href="/Appointments">Appointments</Link></CommandItem>
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>

  );

}