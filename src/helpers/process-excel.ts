import excelToJson from "convert-excel-to-json";
import fs from "fs-extra";

export async function processExcel(filePath: string) {
  try {
    const result = excelToJson({
      sourceFile: filePath,
      header: {
        rows: 1,
      },
      columnToKey: {
        "*": "{{columnHeader}}",
      },
    });

    // Clean up the file after processing
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Define required headers (case-insensitive)
    const REQUIRED_HEADERS = [
      "firstname",
      "lastname",
      "contactemail",
      "contactphonenumber",
    ];

    // Function to validate headers
    const validateHeaders = (headers: string[]) => {
      const normalizedHeaders = headers.map((header) =>
        header.toString().toLowerCase().trim()
      );

      const missingHeaders: string[] = [];
      const extraHeaders: string[] = [];

      // Check for missing required headers
      for (const requiredHeader of REQUIRED_HEADERS) {
        if (!normalizedHeaders.includes(requiredHeader)) {
          missingHeaders.push(requiredHeader);
        }
      }

      // Check for extra headers that aren't allowed
      for (const header of normalizedHeaders) {
        if (!REQUIRED_HEADERS.includes(header)) {
          extraHeaders.push(header);
        }
      }

      if (missingHeaders.length > 0 || extraHeaders.length > 0) {
        let errorMessage = "Invalid Excel headers detected:\n";

        if (missingHeaders.length > 0) {
          errorMessage += `Missing required headers: ${missingHeaders.join(", ")}\n`;
        }

        if (extraHeaders.length > 0) {
          errorMessage += `Invalid/extra headers found: ${extraHeaders.join(", ")}\n`;
        }

        errorMessage += `\nRequired headers (case-insensitive): ${REQUIRED_HEADERS.join(", ")}`;

        throw new Error(errorMessage);
      }
    };

    // Function to normalize headers to standard case
    const normalizeHeaders = (data: any[]) => {
      const headerMapping: Record<string, string> = {
        firstname: "firstName",
        lastname: "lastName",
        contactemail: "contactEmail",
        contactphonenumber: "contactPhoneNumber",
      };

      return data.map((row) => {
        const normalizedRow: Record<string, any> = {};

        for (const [key, value] of Object.entries(row)) {
          const normalizedKey = key.toLowerCase().trim();
          const standardKey = headerMapping[normalizedKey];

          if (standardKey) {
            normalizedRow[standardKey] = value;
          }
        }

        return normalizedRow;
      });
    };

    // Process the result to get clean data arrays
    const processedData: Record<string, any[]> = {};

    for (const [sheetName, data] of Object.entries(result)) {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`Sheet "${sheetName}" is empty or invalid`);
      }

      // Get headers from the first row
      const headers = Object.keys(data[0]);

      // Validate headers
      validateHeaders(headers);

      // Filter out empty rows and clean the data
      const cleanedData = (data as any[]).filter((row) => {
        // Check if row has at least one non-empty value
        return Object.values(row).some(
          (value) => value !== null && value !== undefined && value !== ""
        );
      });

      // Normalize headers to standard case
      const normalizedData = normalizeHeaders(cleanedData);

      processedData[sheetName] = normalizedData;
    }

    const firstSheetData = Object.values(processedData)[0];

    return firstSheetData;
  } catch (error: unknown) {
    // Clean up the file in case of error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(
      `Failed to process Excel file: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
