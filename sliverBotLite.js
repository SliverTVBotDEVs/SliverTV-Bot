// ==UserScript==
// @name         Sliver-Bot by NickPablo
// @namespace    http://NickPablo.de/
// @version      0.1.0
// @description  Sliver.tv Bot
// @author       NickPablo
// @include      https://www.sliver.tv/win/fortnite
// @include      https://www.sliver.tv/win/pubg
// @include      https://www.sliver.tv/win/lol
// @include      https://www.sliver.tv/win/csgo
// @include      https://www.sliver.tv/win/hearthstone
// @include      https://www.sliver.tv/win/sliverspotlight
// @include      https://www.sliver.tv/win/theta
// @include      https://www.sliver.tv/win/wow
// @include      https://www.sliver.tv/account/inventory
// @match        https://www.sliver.tv/win/fortnite
// @match        https://www.sliver.tv/win/pubg
// @match        https://www.sliver.tv/win/lol
// @match        https://www.sliver.tv/win/csgo
// @match        https://www.sliver.tv/win/hearthstone
// @match        https://www.sliver.tv/win/sliverspotlight
// @match        https://www.sliver.tv/win/theta
// @match        https://www.sliver.tv/win/wow
// @match        https://www.sliver.tv/account/inventory
// @grant        none
// ==/UserScript==

(function() {

    ////////////////////////////////////////////////////////////////////////////
    // Settings
    //
    var ClaimAllInvCoins = false;         // ---
    var OpenAllInvCrates = false;         // (Only on https://www.sliver.tv/account/inventory)
    var WatchAndWinBet = false;           // (Only A in donator A-B and Random)
    //
    //////////////////////////////////////////////////////////////////////////////

    var contentPanel = getEBCN('content-panel')[0];
    var miniGamePanel = getEBCN('mini-game-panel')[0];
    var rafflePrizes = getEBCN('prize-container');
    var fixedWallet = getEBCN('fixed-wallet')[0];
    var betCards = getEBCN('waw-prediction-card');
    var raffleContainer = getEBCN('grand-raffle-container');
    var chatContainer = getEBCN('footer-content-container');
    var open = getEBCN('action-button');
    var openCrate = getEBCN('open-crate-button');
    var cont = getEBCN('continue-button');


    function getEBCN(className)
    {
        return document.getElementsByClassName(className);
    }

    function getBetTitle(betCard)
    {
        return getCards()[betCard].firstChild.innerHTML;
    }

    function getBetSelectedS(betCard)
    {
        return getCards()[betCard].children[1].children[0].children[0].children[0].innerHTML;
    }

    function getBetSelectedL(betCard)
    {
        return getCards()[betCard].children[1].children[0].children[1].innerHTML;
    }

    function getAnswer(betCard, ans)
    {
        return getCards()[betCard].children[1].children[0].children[ans];
    }

    function getCards()
    {
        return getEBCN('waw-prediction-card');
    }

    function getRaffleContainer()
    {
      return getEBCN('grand-raffle-container');
    }

    //###########################################
    function isPlaced(betCard)
    {
        return getCards()[betCard].children[1].children[0].classList.contains("waw-prediction-choice--selected");
    }

    function isWon(betCard)
    {
        return getCards()[betCard].children[1].children[0].classList.contains("waw-user-result-message__win");
    }

    function isFail(betCard)
    {
        return getCards()[betCard].children[1].children[0].classList.contains("waw-user-result-message__lose");
    }

    function isRafflePlaced(conId,raffleID,pos)
    {
        return getRaffleContainer()[conId].children[pos].children[raffleID].children[2].classList.contains("grand-raffle-action--is-completed");
    }

    function isOnlyUSRaffle(raffleID)
    {
        var isUsRaffle = false;
        if(getRaffleContainer()[raffleID].children[1].innerHTML.includes("(US)")) {
            isUsRaffle = true;
        }
        if (!takeUsRaffle) {
            isUsRaffle = false;
        }
        return isUsRaffle;
    }

    function whatIsSelected(betCard)
    {
        var selected = "none";
        var sel = false;

        if (isWon(betCard) == true && isFail(betCard) == true) {
            selected = "winfail";
            sel = true;
        }

        if(isPlaced(betCard))
        {
            selected = "selected";
            sel = true;
        }
        if (sel)
        {
            return parseInt(selected);
        }
        else
        {
            return selected;
        }
    }
    //###########################################

    function print()
    {
        for (let i = 0; i < getCards().length; i++)
        {
            console.log("--------- " + getBetTitle(i));
            if (whatIsSelected(i) == "none")
            {
                console.log("--- Keine selected");
            }
            else if (whatIsSelected(i) == "winfail") {
                console.log("--- Gewonnen oder Fail");
            }
            else
            {
                console.log("-- Your answer: " + getBetSelectedS(i) + " (" + getBetSelectedL(i) + ")");
            }
            console.log('\n');
        }
    }

    function betCardsOne(opt)
    {
        var option = -1;
        var optionArray = Array(0,1);
        switch (opt)
        {
            case "A":
                option = 0;
                break;
            case "B":
                option = 0;
                break;
            case "Y":
                option = 0;
                break;
            default:
                option = 0;
        }

        for (let i = 0; i < getCards().length; i++)
        {
            if (option == 2) {
                option = optionArray[Math.floor(Math.random()*optionArray.length)];
            }

            if (isWon(i) == false && isFail(i) == false) {
              if (!isPlaced(i)) {
                if (getCards()[i].children[1].children.length < 2) {

                    console.log("#--# Bei " + getBetTitle(i) + " gibt es nur A! #--#");
                    option = 0;
                }
                getCards()[i].children[1].children[option].children[1].click();
                console.log("#--# Alle Wetten gesetzt #--# Antwort:" + String(option));
              }
            }
        }
    }

    function style()
    {

        contentPanel.innerHTML = "";
        fixedWallet.innerHTML = "";
        miniGamePanel.style.flexBasis = "100%";

        for (let i = 0; i < betCards.length; i++)
        {
            centerize(betCards[i]);
        }

        for (let i = 0; i < rafflePrizes.length; i++)
        {
            centerize(rafflePrizes[i]);
        }
    }

    function centerize(array)
    {
        array.classList.add("center");
    }

    function openCratesFromInv()
    {
        var crateInterval = setInterval(function()
                                        {
            if (getEBCN('continue-button').length == 0 && getEBCN('crate-inventory-type').length > 0)
            {
                for (let i = 0 ; i < getEBCN('crate-inventory-type').length; i++)
                {
                    getEBCN('crate-inventory-type')[0].children[4].click();
                    setTimeout(function() {getEBCN('open-crate-button')[0].click();}, 3000);
                    setTimeout(function() {getEBCN('continue-button')[0].click();}, 18000);
                }
            }
            else
            {
                clearInterval(crateInterval);
            }
        }, 25000);
    }

    function claimAllCoins()
    {
        var length = getEBCN('coins-inventory-type').length;
        for(let i = 0; i < length; i++)
        {

            setTimeout(function()
            {
                getEBCN('coins-inventory-type')[i].children[4].children[0].click();
            }, 3000);

        }
        console.log(length + " coin(s) opened.");
    }

    setInterval(function()
    {
      if (ClaimAllInvCoins) {
          claimAllCoins();
      }
      if (OpenAllInvCrates) {
        openCratesFromInv();
      }
      if (WatchAndWinBet) {
        betCardsOne("A");
      }

    }, 2000);

    //##########################################################################
})();
