import * as React from "react"


const FAQStyle = {marginTop: 40, fontWeight: 700}

export default () => (

    <div>
        <h2>☕ Our mission: </h2>

        <p>Make it as easy as possible to create and order custom tea.
            Our passion for high-quality tea and your creativitea make a great combination.

            Whether it's for yourself or as a gift, we hope
            you enjoy your tea!</p>

        <p>We'd love to hear what you think. Suggestions? Questions about your order?
            Critique? Use the 'Send us a message' button at the bottom to get in touch.</p>

        <p>We're based in Raleigh, North Carolina.</p>

        <hr style={{marginTop: 50}} />
        <h2 style={{marginTop: 50}}>🍵 FAQ</h2>

        <h3 style={{...FAQStyle, marginTop: 20}}>How are we different from other
            online tea shops?</h3>
        <p>We focus on the experience of creating personalized teas.
            While a few
            existing shops will make custom blends, our goal is to make
            this as easy
            as possible. We focus on high-quality teas, with a
            user-friendly
            design page. Enjoy the quality and taste, blended with your
            creativitea.</p>

        <h3 style={FAQStyle}>Do you ship outside the US?</h3>
        <p>Not at this time. We'd like to in the future though!</p>

        <h3 style={FAQStyle}>Do you plan to increase your
            selection of ingredients?</h3>
        <p>Yes! We're just getting started, and will increase our
            selection over time.
            Have a specific inredient you'd like to see? Let us know using
            the 'Send us a message'
            button below.</p>

        <h3 style={FAQStyle}>How quickly do you ship orders?</h3>
        <p>We ship your order within 3 days of when you place it.</p>

        <h3 style={FAQStyle}>Will you send marketing emails after I order?</h3>
        <p>Not a chance.</p>

        <h3 style={FAQStyle}>Can I register an account to save my blends and shipping/payment info?</h3>
        <p>Not currently. We've decided to keep our order process simple and streamlined by
            forgoeing user accounts. It's one less thing for you to remember, and the best
            way to keep your personal info safe is not to store it at all.
            If you'd like to see this change, send us a message.</p>

        <h3 style={FAQStyle}>Other tea stores advertise health
            and medicinal benefits associated with their
            teas and ingredients. What benefits are associated with
            yours?</h3>
        <p>Enjoy the taste and caffeine kick. Some chemicals in green tea have been found
            to have antioxidant, anticarcinogen, and anti-inflammatory effects in lab studies, but
            there's no evidence that drinking tea offers these benefits. We encourage you to do
            your own
            research. If it sounds too good to be true...</p>

        <p>All the ingredients we offer are plant-based, so they
            contain complex organic molecules that may affect your body. For example, cacao (chocolate)
            contains theobromine - a stimulent similar to, but weaker than caffeine,
            and hibiscus contains vitamin C. </p>

        <h3 style={FAQStyle}>Does tea expire?</h3>
        <p>Tea lasts for years due to its low moisture content. Store in
            an area with low humidty like a box or cabinet. Over time the flavor may
            dull (More so in green tea than black), but old tea is safe to drink.</p>
    </div>
)