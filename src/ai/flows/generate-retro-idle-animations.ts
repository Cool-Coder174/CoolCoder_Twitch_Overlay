'use server';
/**
 * @fileOverview A Genkit flow that generates a detailed description of a retro-themed idle animation.
 *
 * - generateRetroIdleAnimations - A function that triggers the generation of an idle animation description.
 * - GenerateRetroIdleAnimationsInput - The input type for the generateRetroIdleAnimations function.
 * - GenerateRetroIdleAnimationsOutput - The return type for the generateRetroIdleAnimations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema for the flow, currently an empty object as no dynamic input is specified.
const GenerateRetroIdleAnimationsInputSchema = z.object({});
export type GenerateRetroIdleAnimationsInput = z.infer<typeof GenerateRetroIdleAnimationsInputSchema>;

// Output schema for the flow, a string describing the generated animation.
const GenerateRetroIdleAnimationsOutputSchema = z
  .string()
  .describe('A detailed description of a retro-themed idle animation, including visual characteristics, motion, and looping behavior.');
export type GenerateRetroIdleAnimationsOutput = z.infer<typeof GenerateRetroIdleAnimationsOutputSchema>;

// Defines a tool that provides a list of abstract, retro-themed idle animation ideas.
const getRetroAnimationIdeas = ai.defineTool(
  {
    name: 'getRetroAnimationIdeas',
    description: 'Retrieves a list of abstract, retro-themed idle animation ideas for system idle screens.',
    inputSchema: z.object({}), // No specific input needed for this tool
    outputSchema: z.array(z.string().describe('A retro-themed animation idea, such as "matrix rain", "oscilloscope waveform", or "blinking light patterns".')),
  },
  async () => {
    // A predefined list of retro-themed animation ideas.
    return [
      'matrix rain',
      'oscilloscope waveform patterns',
      'blinking system activity lights',
      'digital equalizer bars',
      'old school fractal animations',
      'simple starfield parallax',
      'retro loading bar sequences',
      'geometric wireframe rotations',
      'flickering terminal text blocks',
      'abstract circuit board traces with data flow',
    ];
  }
);

// Defines the prompt for the AI model to generate the animation description.
const retroIdleAnimationPrompt = ai.definePrompt({
  name: 'retroIdleAnimationPrompt',
  tools: [getRetroAnimationIdeas], // Make the tool available to the LLM
  input: {
    schema: GenerateRetroIdleAnimationsInputSchema, // Associate input schema with the prompt
  },
  output: {
    schema: GenerateRetroIdleAnimationsOutputSchema, // Associate output schema with the prompt
  },
  system: `You are an AI assistant specialized in creating evocative descriptions for retro computing aesthetics.
Your primary goal is to generate a detailed description of a single abstract, retro-themed idle animation that suggests system activity.
To achieve this, first use the 'getRetroAnimationIdeas' tool to retrieve a list of diverse animation concepts.
Then, from the ideas provided by the tool, select one that you find most compelling and provide a rich, imaginative description.
Your description should cover its visual elements, motion characteristics, potential color palette suggestions (consistent with retro themes), and how it would appear as a seamless, looping background element for an idle screen.
The output should be a standalone description ready for a UI developer to interpret and implement.`,
});

// Defines the main Genkit flow for generating retro idle animations.
const generateRetroIdleAnimationsFlow = ai.defineFlow(
  {
    name: 'generateRetroIdleAnimationsFlow',
    inputSchema: GenerateRetroIdleAnimationsInputSchema,
    outputSchema: GenerateRetroIdleAnimationsOutputSchema,
  },
  async (input) => {
    // Call the prompt to get the animation description.
    const { output } = await retroIdleAnimationPrompt(input);
    // Ensure output is not null and return it.
    return output!;
  }
);

// Exported wrapper function to call the Genkit flow.
export async function generateRetroIdleAnimations(
  input: GenerateRetroIdleAnimationsInput
): Promise<GenerateRetroIdleAnimationsOutput> {
  return generateRetroIdleAnimationsFlow(input);
}
