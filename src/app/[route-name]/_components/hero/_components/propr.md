create a dialog - when a user click on edit btn then it shoudle open and inside that dialog i need  ui soemting like the image that i have provided, this will use that    that libarary for avar img 

'
import React from "react";
import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {};

export default function EditProfileImgDialog({}: Props) {
  const avatar = createAvatar(notionists, {
    seed: "utkarsh",
    beard: ["variant03"],
    body: ["variant03"],
  });

  const svg = avatar.toString();

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="absolute right-10 top-10" variant={"outline"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-gray-100">
            {/* <img src={svg} alt="Avatar" /> */}
            {/* <Svg /> */}
            <div
              className="h-32 w-32 rounded-full bg-gray-100"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


'
when a user change someing on the left side so the final img shodule show on right side and on the left side when tools are more then it will have scrollbar only on left side this whole ui shoulde be fully mobile responsive 

use all these properties -- 

`
seed : string - `random string`

flip :boolean

scale: Type integer Minimum 0 Maximum 200
beard : variant01, variant02, variant03, variant04, variant05, variant06, variant07, variant08, variant09, variant10, variant11, variant12

body: variant01, variant02, variant03, variant04, variant05, variant06, variant07, variant08, variant09, variant10, variant11, variant12, variant13, ... variant25

<!-- eyebrows -->
brows : variant01, variant02, variant03, variant04, variant05, variant06, variant07, variant08, variant09, variant10, variant11, variant12, variant13,

gesture : `hand, handPhone, ok, okLongArm, point, pointLongArm, waveLongArm, waveLongArms, waveOkLongArms, wavePointLongArms`

glasses: variant01, variant02, variant03, variant04, variant05, variant06, variant07, variant08, variant09, variant10, variant11,

hair : `hat, variant01, variant02, variant03, variant04, variant05, variant06, variant07, variant08, variant09, variant10, variant11, variant12, variant13, variant14, variant15, variant16, variant17, variant18, variant19, variant20, variant21, variant22, variant23, variant24, variant25, variant26, variant27, variant28, variant29, variant30, variant31, variant32, variant33, variant34, variant35, variant36, variant37, variant38, variant39, variant40, variant41, variant42, variant43, variant44, variant45, variant46, variant47, variant48, variant49, variant50, variant51, variant52, variant53, variant54, variant55, variant56, variant57, variant58, variant59, variant60, variant61, variant62, variant63`

lips: `variant01, variant02, variant03, variant04, variant05, variant06, variant07, variant08, variant09, variant10, variant11, variant12, variant13, variant14, variant15, variant16, variant17, variant18, variant19, variant20, variant21, variant22, variant23, variant24, variant25, variant26, variant27, variant28, variant29, variant30`

nose: `variant01, variant02, variant03, variant04, variant05, variant06, variant07, variant08, variant09, variant10, variant11, variant12, variant13, variant14, variant15, variant16, variant17, variant18, variant19, variant20`

`