import consola from "consola";
import { AutocompleteInteraction, CacheType } from "discord.js";
import timezones from "timezones-list";

// Get all timezones
export const tzList = timezones.map((timezone) => {
    return timezone.tzCode;
});

export async function tzAutocomplete(interaction: AutocompleteInteraction<CacheType>) {
    const maxResults = 20;
    const value = interaction.options.get("timezone")?.value as string;
    const results = [];
    if (value) {
        results.push(...tzList.filter((tz: string) => tz.toLowerCase().includes(value.toLowerCase())));
    } else {
        results.push(...tzList);
    }

    results.length = Math.min(results.length, maxResults);

    try {
        await interaction.respond(
            results.map(tz => ({ name: tz, value: tz })),
        );
    } catch (error) {
        consola.error("Time is (in func tzAutoComp): " + Date.now() + error);
    }
}
