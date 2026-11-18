import type { ComponentProps } from "react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Bank as BankIcon,
  CalendarDots,
  CaretDown,
  CaretRight,
  CaretUpDown,
  Check as CheckIcon,
  CheckCircle as CheckCircleIcon,
  SealCheck as SealCheckIcon,
  CircleNotch,
  Compass as CompassIcon,
  CurrencyCircleDollar,
  Desktop,
  Eye as EyeIcon,
  FileText,
  FunnelSimple,
  FilmSlate,
  Gear,
  Heart as HeartIcon,
  House,
  Info as InfoIcon,
  Lightning as LightningIcon,
  List,
  LinkSimple,
  Lock as LockIcon,
  MagnifyingGlass,
  Medal as MedalIcon,
  Megaphone as MegaphoneIcon,
  Minus as MinusIcon,
  Money,
  Moon as MoonIcon,
  MusicNotes,
  Percent as PercentIcon,
  Play as PlayIcon,
  Plugs,
  Scissors as ScissorsIcon,
  ShieldCheck as ShieldCheckIcon,
  SidebarSimple,
  SignOut,
  SquaresFour,
  Stamp as StampIcon,
  Sun as SunIcon,
  Timer as TimerIcon,
  UploadSimple,
  User as UserIcon,
  VideoCamera,
  Wallet as WalletIcon,
  Warning as WarningIcon,
  WarningCircle,
  X,
  XCircle,
} from "@phosphor-icons/react/ssr";
import { cn } from "@/lib/utils";

// Every icon in the app comes from here: Phosphor, filled with soft rounded corners
// (DESIGN.md → Icons). Screens import by name from "@/components/icons", so the set
// can change in one file. Sized by CSS (size-5 by default), coloured by currentColor.
// Small directional marks (carets, arrows, close, check) use the bold weight, which
// reads better than a filled shape at small sizes.

export type IconProps = Omit<ComponentProps<PhosphorIcon>, "ref">;
export type IconComponent = (props: IconProps) => React.JSX.Element;
type Weight = NonNullable<IconProps["weight"]>;

function make(Icon: PhosphorIcon, name: string, defaultWeight: Weight = "fill"): IconComponent {
  const Wrapped = ({ weight = defaultWeight, className, ...props }: IconProps) => (
    <Icon weight={weight} aria-hidden="true" className={cn("size-5", className)} {...props} />
  );
  Wrapped.displayName = name;
  return Wrapped;
}

// Objects and places: filled.
export const AlertCircle = make(WarningCircle, "AlertCircle");
export const Bank = make(BankIcon, "Bank");
export const Banknote = make(Money, "Banknote");
export const Calendar = make(CalendarDots, "Calendar");
export const CheckCircle = make(CheckCircleIcon, "CheckCircle");
export const SealCheck = make(SealCheckIcon, "SealCheck");
export const Clapperboard = make(FilmSlate, "Clapperboard");
export const Compass = make(CompassIcon, "Compass");
export const DollarCircle = make(CurrencyCircleDollar, "DollarCircle");
export const ErrorCircle = make(XCircle, "ErrorCircle");
export const Eye = make(EyeIcon, "Eye");
export const File = make(FileText, "File");
export const Filter = make(FunnelSimple, "Filter");
export const Grid = make(SquaresFour, "Grid");
export const Heart = make(HeartIcon, "Heart");
export const Home = make(House, "Home");
export const Info = make(InfoIcon, "Info");
export const Lightning = make(LightningIcon, "Lightning");
export const Link = make(LinkSimple, "Link", "bold");
export const Lock = make(LockIcon, "Lock");
export const Medal = make(MedalIcon, "Medal");
export const LogOut = make(SignOut, "LogOut");
export const Search = make(MagnifyingGlass, "Search", "bold");
export const Megaphone = make(MegaphoneIcon, "Megaphone");
export const Monitor = make(Desktop, "Monitor");
export const Moon = make(MoonIcon, "Moon");
export const Music = make(MusicNotes, "Music");
export const PanelLeft = make(SidebarSimple, "PanelLeft");
export const Percent = make(PercentIcon, "Percent", "bold");
export const Play = make(PlayIcon, "Play");
export const Plug = make(Plugs, "Plug");
export const Scissors = make(ScissorsIcon, "Scissors");
export const Settings = make(Gear, "Settings");
export const ShieldCheck = make(ShieldCheckIcon, "ShieldCheck");
export const Stamp = make(StampIcon, "Stamp");
export const Sun = make(SunIcon, "Sun");
export const Timer = make(TimerIcon, "Timer");
export const Upload = make(UploadSimple, "Upload", "bold");
export const User = make(UserIcon, "User");
export const Video = make(VideoCamera, "Video");
export const Wallet = make(WalletIcon, "Wallet");
export const Warning = make(WarningIcon, "Warning");

// Small directional marks: bold line.
export const ArrowLeft = make(ArrowLeftIcon, "ArrowLeft", "bold");
export const ArrowRight = make(ArrowRightIcon, "ArrowRight", "bold");
export const Check = make(CheckIcon, "Check", "bold");
export const ChevronDown = make(CaretDown, "ChevronDown", "bold");
export const ChevronRight = make(CaretRight, "ChevronRight", "bold");
export const ChevronsUpDown = make(CaretUpDown, "ChevronsUpDown", "bold");
export const Close = make(X, "Close", "bold");
export const Menu = make(List, "Menu", "bold");
export const Minus = make(MinusIcon, "Minus", "bold");
export const Spinner = make(CircleNotch, "Spinner", "bold");
