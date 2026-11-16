import type { ComponentProps } from "react";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import {
  Alert02Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  BankIcon,
  BanknoteIcon,
  Calendar03Icon,
  CancelCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  ClapperboardIcon,
  ComputerIcon,
  DollarCircleIcon,
  EyeIcon,
  FavouriteIcon,
  Home01Icon,
  InformationCircleIcon,
  Link01Icon,
  Loading03Icon,
  Logout01Icon,
  Megaphone01Icon,
  Menu01Icon,
  MinusSignIcon,
  Moon02Icon,
  MusicNote01Icon,
  PercentIcon,
  PlayIcon,
  ScissorIcon,
  SecurityCheckIcon,
  Settings01Icon,
  SidebarLeft01Icon,
  Stamp01Icon,
  Sun03Icon,
  Tick02Icon,
  Timer02Icon,
  UnfoldMoreIcon,
  Upload04Icon,
  Video01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";

// Every icon in the app comes from here (Hugeicons, stroke rounded). Screens import
// by name from "@/components/icons", so the icon set can change in one file.
// Default: 1.5 stroke, sized by CSS (size-4/size-5), coloured by currentColor.

export type IconProps = Omit<ComponentProps<typeof HugeiconsIcon>, "icon">;
export type IconComponent = (props: IconProps) => React.JSX.Element;

function make(icon: IconSvgElement, name: string): IconComponent {
  const Icon = ({ strokeWidth = 1.5, ...props }: IconProps) => (
    <HugeiconsIcon icon={icon} strokeWidth={strokeWidth} aria-hidden="true" {...props} />
  );
  Icon.displayName = name;
  return Icon;
}

export const AlertCircle = make(AlertCircleIcon, "AlertCircle");
export const ArrowRight = make(ArrowRight01Icon, "ArrowRight");
export const Bank = make(BankIcon, "Bank");
export const Banknote = make(BanknoteIcon, "Banknote");
export const Calendar = make(Calendar03Icon, "Calendar");
export const Check = make(Tick02Icon, "Check");
export const CheckCircle = make(CheckmarkCircle02Icon, "CheckCircle");
export const ChevronDown = make(ArrowDown01Icon, "ChevronDown");
export const ChevronRight = make(ArrowRight01Icon, "ChevronRight");
export const ChevronsUpDown = make(UnfoldMoreIcon, "ChevronsUpDown");
export const Clapperboard = make(ClapperboardIcon, "Clapperboard");
export const Close = make(Cancel01Icon, "Close");
export const DollarCircle = make(DollarCircleIcon, "DollarCircle");
export const ErrorCircle = make(CancelCircleIcon, "ErrorCircle");
export const Eye = make(EyeIcon, "Eye");
export const Heart = make(FavouriteIcon, "Heart");
export const Home = make(Home01Icon, "Home");
export const Info = make(InformationCircleIcon, "Info");
export const Link = make(Link01Icon, "Link");
export const LogOut = make(Logout01Icon, "LogOut");
export const Megaphone = make(Megaphone01Icon, "Megaphone");
export const Menu = make(Menu01Icon, "Menu");
export const Minus = make(MinusSignIcon, "Minus");
export const Monitor = make(ComputerIcon, "Monitor");
export const Moon = make(Moon02Icon, "Moon");
export const Music = make(MusicNote01Icon, "Music");
export const PanelLeft = make(SidebarLeft01Icon, "PanelLeft");
export const Percent = make(PercentIcon, "Percent");
export const Play = make(PlayIcon, "Play");
export const Scissors = make(ScissorIcon, "Scissors");
export const Settings = make(Settings01Icon, "Settings");
export const ShieldCheck = make(SecurityCheckIcon, "ShieldCheck");
export const Spinner = make(Loading03Icon, "Spinner");
export const Stamp = make(Stamp01Icon, "Stamp");
export const Sun = make(Sun03Icon, "Sun");
export const Timer = make(Timer02Icon, "Timer");
export const Upload = make(Upload04Icon, "Upload");
export const Video = make(Video01Icon, "Video");
export const Wallet = make(Wallet01Icon, "Wallet");
export const Warning = make(Alert02Icon, "Warning");
