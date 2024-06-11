import type { ComponentType } from "svelte";
import Discord from "./links/Discord.svelte";
import Github from "./links/Github.svelte";
import Steam from "./links/Steam.svelte";
import Twitch from "./links/Twitch.svelte";
import Youtube from "./links/Youtube.svelte";
import Links from "./main/Links.svelte";
import Logo from "./main/Logo.svelte";
import AboutMe from "./main/AboutMe.svelte";
import Text from "./aboutMe/Text.svelte";
import Trivia from "./aboutMe/Trivia.svelte";
import About from "./thisSite/About.svelte";
import TechInfo from "./thisSite/TechInfo.svelte";
import SidesSwitch from "./thisSite/SidesSwitch.svelte";
import SvelteSides from "./thisSite/SvelteSides.svelte";
import ReturnHome from "../ReturnHome.svelte";
import GimkitCheat from "./projects/GimkitCheat.svelte";
import GimkitSpawner from "./projects/GimkitSpawner.svelte";
import DiscordWiderUserArea from "./projects/DiscordWiderUserArea.svelte";
import Gimloader from "./projects/Gimloader.svelte";
import DiscordImageFolder from "./projects/DiscordImageFolder.svelte";
import DiscordUnicodeEmojis from "./projects/DiscordUnicodeEmojis.svelte";
import DiscordZipPreview from "./projects/DiscordZipPreview.svelte";
import DiscordGifCaptioner from "./projects/DiscordGifCaptioner.svelte";
import GimkitPlugins from "./projects/GimkitPlugins.svelte";
import Dldtas from "./projects/gimkitPlugins/DLDTAS.svelte";
import AutoKicker from "./projects/gimkitPlugins/AutoKicker.svelte";
import CharacterCustomization from "./projects/gimkitPlugins/CharacterCustomization.svelte";
import Speedrunning from "./projects/gimkitPlugins/Speedrunning.svelte";
import Trivial from "./projects/gimkitPlugins/Trivial.svelte";
import CustomUi from "./projects/gimkitPlugins/CustomUI.svelte";
import Projects from "./main/Projects.svelte";

export const cubes: Record<string, ComponentType[]> = {
    'main': [ Links, Logo, AboutMe, Projects ],
    'links': [ Discord, Github, Steam, Twitch, Youtube, ReturnHome ],
    'aboutMe': [ Text, ReturnHome, Trivia ],
    'thisSite': [ About, ReturnHome, TechInfo, SidesSwitch, SvelteSides ],
    'projects': [ ReturnHome, GimkitCheat, GimkitSpawner, Gimloader, DiscordWiderUserArea, DiscordImageFolder, DiscordUnicodeEmojis, DiscordZipPreview, DiscordGifCaptioner, GimkitPlugins ],
    'gimkit': [ ReturnHome, Dldtas, AutoKicker, CharacterCustomization, Speedrunning, Trivial, CustomUi ]
}