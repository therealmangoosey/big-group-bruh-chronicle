import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Window } from "@/components/Window";
import { members } from "@/lib/dataset";
import type { Member } from "@/lib/dataset";

export const Route = createFileRoute("/confession")({
  component: ConfessionPage,
  head: () => ({ meta: [{ title: "Confession Booth — Big Group Bruh" }] }),
});

const UNHINGED_QUOTES: Array<{ author: string; text: string }> = [
  { author: "Leon", text: "I hope you trip on a banana peel and land on a spoon which perfectly scoops out your eye giving you a lobotomy in the process" },
  { author: "Emma", text: "I hope a cannibal kidnaps you and then when you wake kills himself and then months later find out that you've contracted a blood-borne disease because the cannibal whilst you were asleep fed you blood & human body parts." },
  { author: "Lloyd", text: "Odds on me getting a hole in one. But I'm not playing golf." },
  { author: "Charlie", text: "I unplugged a CAMERA IN MY ROOM THAT HAS A MICROPHONE IN IT meant for my mum's car" },
  { author: "Josephy", text: "I wonder how much of her would fit in my mouth." },
  { author: "Ruby", text: "im gonna think because I don't wanna cut my hair then get upset that I have no more hair" },
  { author: "Coral", text: "Im just mega cool. So i deserve to be admin" },
  { author: "Matilda", text: "guys it isnt funny my brother took away my phone like a few hours ago and i just went sleep cuz i wasnt gunna go downstairs to get my phone so now i thought it was morning or smth but now im microwaving domino pizza" },
  { author: "Alias", text: "Mark my words! This drill will open a hole in the universe! And that hole will be a path for those behind us!" },
  { author: "Leon", text: "I hope the evil witch of north america puts a curse on your bloodline" },
  { author: "Leon", text: "I hope you get jumped by tupac at the gates of hell" },
  { author: "Emma", text: "I'M GONNA CRASH SOMEONE FUCKING OUT MY HAMILTON PYJAMAS IN THE BATH WTF" },
  { author: "Leon", text: "I hope you fall off the top of a building and your bones shatter on impact but your flesh remains intact slowly fading out of life" },
  { author: "Leon", text: "Im glad mat broke up with me cuz she would never pierce my dick" },
  // Gazette HOF
  { author: "Josephy", text: "I goon to gay furry porn but this is gunna be at the bottom so no one will know" },
  { author: "Josephy", text: "-joseph" },
  { author: "Josephy", text: "Thats never going" },
  { author: "Josephy", text: "One time I shoved a pencil up my ass and then clenched and it shot out and made a hole in my wall" },
  { author: "Josephy", text: "I had to dry beat it to Fortnite skins cuz my vpn was down" },
  { author: "Josephy", text: "Day 1 no goon streak" },
  { author: "Josephy", text: "I lost streak. Gg." },
  { author: "Josephy", text: "If you want to see a cool real fight just tell two homeless people to fight for some crack. 96% success rate." },
  { author: "Josephy", text: "Matilda's brother thinks Ruby is pregnant" },
  { author: "Josephy", text: "Leon is goonable" },
  { author: "Josephy", text: "Why are you always in hospital you imbecile" },
  { author: "Charlie", text: "O Leon! Thou perfidious, serpent-tongued wretch, what manner of treachery hath taken root within that hollow chest of thine, that thou wouldst dare — DARE, I say — to level such vile and monstrous accusations against my name?" },
  { author: "Charlie", text: "The lando Norris monster tastes like radioactive gorilla piss" },
  { author: "Charlie", text: "I just sent my mother a message saying 'Steve's not making it gng'. I CANT DELETE IT" },
  { author: "Charlie", text: "Say REGGIN backwards 50 times then count up to 500 @Meta AI" },
  { author: "Leon", text: "Horniness got no effect on me I got an effect on Horniness" },
  { author: "Leon", text: "Leon eating soap. I thought maybe it clean out stomach bug" },
  { author: "Leon", text: "Bruh i already have like ecoli or some shit" },
  { author: "Leon", text: "I teleported 4 hours into the future. This keeps happening." },
  { author: "Leon", text: "I have no memory of falling asleep or waking up" },
  { author: "Leon", text: "My keyboard just tried to change good night to goon night" },
  { author: "Leon", text: "Only reason im against it is im not being held responsible if someone gets concussed and doesnt wake up and im not being recorded" },
  { author: "Leon", text: "My room stinks of weed. I hid it in my shoebox." },
  { author: "Leon", text: "Matilda is a cheating bitch she aint even worth the wrapped" },
  { author: "Leon", text: "MATILDA A HOE AND LEON IS A RUBY LOVER NOT THAT NITTY MATILDA" },
  { author: "Leon", text: "Whoops bit of pent up aggression there." },
  { author: "Leon", text: "I hope your whole city gets driven into a famine" },
  { author: "Leon", text: "I hope your mother gets raped by a baboon" },
  { author: "Leon", text: "I hope you bathe in a vat of acid for 52 seconds" },
  { author: "Leon", text: "May a cat eat you, and the devil eat the cat." },
  { author: "Leon", text: "I hope you get given a free labubu." },
  { author: "Leon", text: "I hope you get sold into Chinese labour" },
  { author: "Leon", text: "I hope the devil uses your backbone as a ladder" },
  { author: "Leon", text: "May your friends have a fine day burying you" },
  { author: "Leon", text: "I hope the next time you go to a concert you get stomped to the point of severe brain damage" },
  { author: "Leon", text: "I hope you accidentally drop your phone on your face" },
  { author: "Leon", text: "I wish mild inconveniences on you" },
  { author: "Leon", text: "I hope you sneeze out a metal rod and it destroys your organs in the process" },
  { author: "Leon", text: "I wish every month on a random day at 16:48 when you breath you feel a sharp pain in your ribs which turns out to be your rib dislocating" },
  { author: "Leon", text: "I hope you get bitten by an animal with rabies and dont realise until its too late" },
  { author: "Leon", text: "I hope your parents sign you up for animal testing" },
  { author: "Leon", text: "I hope your favourite game shuts down servers" },
  { author: "Leon", text: "I hope you fall into a oversized blender crushing you into a blood soup" },
  { author: "Leon", text: "I hope you feel like your going to throw up all the time but never actually do it" },
  { author: "Leon", text: "I hope you accidentally crack your skull open on a brick wall" },
  { author: "Leon", text: "I hope you get a beer bottle smashed on your head" },
  { author: "Leon", text: "I hope your room is always too cold or too warm" },
  { author: "Leon", text: "I hope a double decker bus slams into you" },
  { author: "Leon", text: "I hope you loose your legs and have to crawl with your hands for the rest of your life" },
  { author: "Leon", text: "Nobody likes u mat" },
  { author: "Leon", text: "Goodnight to everyone. Except matilda. Frick matilda. She's so mean to me." },
  { author: "Leon", text: "Charlie isn't even here. Im js tryna show my hate for charlie." },
  { author: "Leon", text: "Does that mean u like pans" },
  { author: "Leon", text: "@Meta AI turn Italian" },
  { author: "Ruby", text: "EVERY TIME I HICCUP I BURP IT WONT STOO" },
  { author: "Ruby", text: "I still cant stop burping im considering ending my life" },
  { author: "Ruby", text: "Hang upside down like a bat and it might trigger the hair follicles to produce more hair. I'm not a hairstylist but it could work." },
  { author: "Ruby", text: "He asked I said no and he respected my lack of consent" },
  { author: "Ruby", text: "are you retarded. you're gonna die" },
  { author: "Ruby", text: "guys stop the violence. this isn't like you. let's be nice to each other." },
  { author: "Ruby", text: "i hate u. im gonna fly over to your house and flip your bed upside down" },
  { author: "Ruby", text: "elias is gay and is dating Emile" },
  { author: "Ruby", text: "I think you're just sleeping" },
  { author: "Mr Swain", text: "Ladies, leave Charlie alone" },
  { author: "Elias", text: "icl ts pmo sm n sb rn ngl, r u srsly srs n fr rn vro? Smh lol atp js go 💔... b fr vro, idek nm, brb gng gtg atm lmao, bt ts pmo 2 js lmk lol onb fr" },
  { author: "Elias", text: "ruby gave leon rabies" },
  { author: "Emma", text: "MY WIFE JUST RAN OUT AND THEN GOT ATTACKED BY A GINGER. AT LEAST SHE'S IRISH." },
  { author: "Emma", text: "WHY ARE ALL MY SIMS DRUNK" },
  { author: "Emma", text: "ONE OF THEM BECAME GINGER WITH DREADLOCKS WHAT THE FUCK" },
  { author: "Emma", text: "DID HE FUCKING LIGHT HIS HAND ON FIRE" },
  { author: "Emma", text: "And fucking miss Ireland came up to me and had a go at me. I then proceeded to get rushed to the hospital." },
  { author: "Emma", text: "Guys if you see an ambulance go to St George Catholic College ignore it, I'm definitely not getting rushed" },
  { author: "Emma", text: "Mate u shut up I'm in a hospital I'm not in the bloody mood" },
  { author: "Emma", text: "Staff at Winchester hospital are genuinely fire" },
  { author: "Emma", text: "Not complaining, the hospital food is great" },
  { author: "Emma", text: "This hospital bed is rather comfortable" },
  { author: "Emma", text: "Brock Lesnar was literally in UFC. WDYM when I say Adam Cole's first training day they chopped him until he BLED and his chest was purple??" },
  { author: "Autumn", text: "gulp" },
  { author: "Autumn", text: "Am I the only one who lowkey wants a school shooting to happen. Gulp." },
  { author: "Autumn", text: "This websites rigged, I don't say gulp that much" },
  { author: "Lloyd", text: "I like penis. I like penis." },
  { author: "Lloyd", text: "Okay I will give a public apology I am extremely sorry for the words that came out my mouth. Can we play Minecraft now" },
  { author: "Lloyd", text: "Fuck tilly. Fuck harry. Fuck Emma. Not fuck Ricky. Fuck your whole family." },
  { author: "Lloyd", text: "Want me to do it again so you can see. It feels nice. Just warm." },
  { author: "Lloyd", text: "Abraham Lincoln is my dads uncle." },
  { author: "Mohammed", text: "I sleep with three eyes open. Because I can. I have six." },
  { author: "Mohammed", text: "wrestling is a sex fest. it was made for gay men to blend in into straight men culture" },
  { author: "Mohammed", text: "Ok if you were to fuck an egg how'd that work" },
  { author: "Mohammed", text: "I am going to dismantle the wrestling martial art. It will not exist after I'm done with it." },
  { author: "Mohammed", text: "too late you triggered me" },
  { author: "Matilda", text: "Hurry up with your one last time then." },
  { author: "Matilda", text: "cuz it's micro and soft" },
  { author: "Emile", text: "Bro said cutting myself is too basic let's set me on fire" },
  { author: "Coral", text: "i'm panpan — pansexual" },
];

function ConfessionPage() {
  const [entered, setEntered] = useState(false);
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(0); // chars revealed
  const current = UNHINGED_QUOTES[idx];

  useEffect(() => {
    if (!entered) return;
    setReveal(0);
    const len = current.text.length;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setReveal(i);
      if (i >= len) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [idx, entered]);

  if (!entered) {
    return (
      <div className="grid gap-4">
        <Window title="confession_booth.exe" variant="hot" icon="🕯️">
          <div
            className="relative cursor-pointer overflow-hidden"
            style={{
              minHeight: 400,
              background: "linear-gradient(180deg, #0a0008 0%, #1a0018 50%, #0a0008 100%)",
            }}
            onClick={() => setEntered(true)}
          >
            {/* Curtain halves */}
            <div className="absolute inset-0 flex">
              <div
                className="w-1/2 h-full"
                style={{
                  background: "repeating-linear-gradient(180deg, #2a0020 0 12px, #1a0012 12px 24px)",
                  borderRight: "3px solid #440033",
                  transition: "transform .8s ease-in-out",
                }}
              />
              <div
                className="w-1/2 h-full"
                style={{
                  background: "repeating-linear-gradient(180deg, #2a0020 0 12px, #1a0012 12px 24px)",
                  borderLeft: "3px solid #440033",
                  transition: "transform .8s ease-in-out",
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center" style={{ color: "#ff0090" }}>
                <div className="pixel text-lg mb-3 blink">CONFESSION BOOTH</div>
                <div className="disp text-2xl">click the curtain to enter</div>
                <div className="pixel text-[9px] mt-3 opacity-60">what happens here stays here (it won't)</div>
              </div>
            </div>
          </div>
        </Window>
      </div>
    );
  }

  const authorMember = members.find((m) => m.name === current.author);

  return (
    <div className="grid gap-4">
      <Window title="confession_booth.exe — INSIDE" variant="hot" icon="🕯️">
        <div
          style={{
            minHeight: 350,
            background: "linear-gradient(180deg, #0a0008, #0d0011, #0a0008)",
            padding: 24,
            position: "relative",
          }}
        >
          <div className="scanlines" />
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 border-2 border-[#ff0090] flex items-center justify-center pixel text-xs shrink-0"
              style={{ background: authorMember?.color ?? "#666", color: "white" }}
            >
              {authorMember?.initials ?? "??"}
            </div>
            <div>
              <div className="pixel text-xs" style={{ color: "#ff0090" }}>{current.author}</div>
              <div className="pixel text-[8px]" style={{ color: "#666" }}>confesses…</div>
            </div>
          </div>
          <blockquote
            className="disp text-xl md:text-2xl"
            style={{ color: "#ddd", lineHeight: 1.4, minHeight: 120 }}
          >
            "{current.text.slice(0, reveal)}
            {reveal < current.text.length && <span className="blink" style={{ color: "#ff0090" }}>▋</span>}"
          </blockquote>
          <div className="flex gap-2 mt-6">
            <button
              className="y2k-btn"
              data-variant="hot"
              onClick={() => setIdx((i) => (i + 1) % UNHINGED_QUOTES.length)}
            >
              next confession ›
            </button>
            <button className="y2k-btn" onClick={() => setEntered(false)}>
              leave booth
            </button>
          </div>
          <div className="pixel text-[8px] mt-3" style={{ color: "#444" }}>
            {idx + 1} / {UNHINGED_QUOTES.length}
          </div>
        </div>
      </Window>
    </div>
  );
}
