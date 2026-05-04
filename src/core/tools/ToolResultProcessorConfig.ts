/**
 * Configuration for the ToolResultProcessor.
 * Controls thresholds for when compression kicks in.
 *
 * IMPORTANT: Thresholds have been tuned based on production data analysis.
 * Data showed that inputs <2000 chars often EXPAND rather than compress (avg 1.34x expansion).
 * Only inputs >5000 chars showed consistent compression benefits.
 *
 * @see plans/compression-fix-plan-v2.md for full analysis
 */
export interface ToolResultProcessorConfig {
	/** Master switch — false disables all LLM compression */
	enabled: boolean

	/** Whether the user is a subscriber (LLM compression requires subscription) */
	isSubscriber: boolean

	/** Character thresholds per tool type. Results below these are not compressed. */
	thresholds: {
		/**
		 * Compress read_file results above this many characters.
		 * Default: 5000 (raised from 1500 based on production data showing expansion for small inputs)
		 */
		readFileCharsAbove: number

		/**
		 * Compress search_files results above this many matches.
		 * Default: 50 (raised from 20 to ensure meaningful compression)
		 */
		searchMatchesAbove: number

		/**
		 * Compress list_files results above this many paths.
		 * Default: 200 (raised from 100 to ensure meaningful compression)
		 */
		listFilesCountAbove: number

		/**
		 * Compress execute_command results above this many characters.
		 * Default: 5000 (raised from 1500 based on production data showing expansion for small inputs)
		 */
		executeCommandCharsAbove: number
	}
}

/**
 * Default configuration with tuned thresholds.
 *
 * These thresholds are intentionally high because:
 * 1. Small inputs (<2000 chars) often EXPAND rather than compress (1.34x average in production)
 * 2. The compression API call itself costs money (~$0.30/M input + $2.50/M output for Gemini Flash)
 * 3. We need at least 30% compression to break even on the economics
 *
 * The server-side also enforces a 5000 char minimum as a safety net.
 */
export const DEFAULT_PROCESSOR_CONFIG: ToolResultProcessorConfig = {
	enabled: true,
	isSubscriber: false,
	thresholds: {
		readFileCharsAbove: 2000,
		searchMatchesAbove: 30,
		listFilesCountAbove: 150,
		executeCommandCharsAbove: 2000,
	},
}
