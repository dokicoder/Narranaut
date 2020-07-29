import ALIEN from '../assets/icons8-day-of-the-tentacle-100.png';
import ARTIFACT from '../assets/icons8-lightsaber-100.png';
import COIN from '../assets/icons8-dollar-coin-100.png';
import GOBLET from '../assets/icons8-trophy-cup-100.png';
import LINK from '../assets/icons8-link-100-2.png';
import LOCATION from '../assets/icons8-place-marker-100-2.png';
import PRIZE from '../assets/icons8-medal-first-place-100.png';
import RELATIONSHIP from '../assets/icons8-restart-love-100.png';
import TOOL from '../assets/icons8-hammer-100.png';
import TREASURE from '../assets/icons8-gold-bars-100.png';
import VESSEL from '../assets/icons8-box-100.png';
import WEAPON from '../assets/icons8-katana-sword-100.png';

export type Icon =
  | 'ALIEN'
  | 'ARTIFACT'
  | 'CASTLE'
  | 'CHARACTER'
  | 'CHEST'
  | 'COIN'
  | 'CONTRAPTION'
  | 'DEMON'
  | 'DEVICE'
  | 'GOBLET'
  | 'HERO'
  | 'HOUSE'
  | 'HUT'
  | 'ITEM'
  | 'LINK'
  | 'LOCATION'
  | 'MAP'
  | 'MONSTER'
  | 'OBSTACLE'
  | 'PRIZE'
  | 'RELATIONSHIP'
  | 'TOOL'
  | 'TOWER'
  | 'TREASURE'
  | 'VESSEL'
  | 'WEAPON';

export const Icons: Record<Icon, string> = {
  ALIEN,
  ARTIFACT,
  CASTLE: '../assets/',
  CHARACTER: '../assets/',
  CHEST: '../assets/',
  COIN,
  CONTRAPTION: '../assets/',
  DEMON: '../assets/',
  DEVICE: '../assets/',
  GOBLET,
  HERO: '../assets/',
  HOUSE: '../assets/',
  HUT: '../assets/',
  ITEM: '../assets/',
  LINK,
  LOCATION,
  MAP: '../assets/',
  MONSTER: '../assets/',
  OBSTACLE: '../assets/',
  PRIZE,
  RELATIONSHIP,
  TOOL,
  TOWER: '../assets/',
  TREASURE,
  VESSEL,
  WEAPON,
};
