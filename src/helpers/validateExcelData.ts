import path from "path";
import { InvalidRow, ValidatedRow } from "../types/shared";
import fs from "fs-extra";
import XLSX from "xlsx";
import cloudinary from "../config/cloudinary";
import { generateUUID } from "../utils/utils";

// Function to validate data and separate valid from invalid rows
export function validateData(data: any[]): {
  validData: ValidatedRow[];
  invalidData: InvalidRow[];
} {
  const validData: ValidatedRow[] = [];
  const invalidData: InvalidRow[] = [];

  data.forEach((row, index) => {
    const errors: string[] = [];
    const rowNumber = index + 2; // +2 because index starts at 0 and we skip header row

    // Check for required fields
    if (!row.firstName || row.firstName.toString().trim() === "") {
      errors.push("firstName is required");
    }

    if (!row.lastName || row.lastName.toString().trim() === "") {
      errors.push("lastName is required");
    }

    if (!row.contactEmail || row.contactEmail.toString().trim() === "") {
      errors.push("contactEmail is required");
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(row.contactEmail.toString().trim())) {
        errors.push("contactEmail is not a valid email format");
      }
    }

    // Handle contactPhoneNumber as both string and number
    if (
      !row.contactPhoneNumber ||
      (typeof row.contactPhoneNumber === "string" &&
        row.contactPhoneNumber.trim() === "") ||
      (typeof row.contactPhoneNumber === "number" &&
        isNaN(row.contactPhoneNumber))
    ) {
      errors.push("contactPhoneNumber is required");
    }

    if (errors.length > 0) {
      // Add to invalid data
      invalidData.push({
        rowNumber,
        firstName: row.firstName ? row.firstName.toString() : "",
        lastName: row.lastName ? row.lastName.toString() : "",
        contactEmail: row.contactEmail ? row.contactEmail.toString() : "",
        contactPhoneNumber: row.contactPhoneNumber
          ? row.contactPhoneNumber.toString()
          : "",
        errors,
      });
    } else {
      // Add to valid data
      validData.push({
        firstName: row.firstName.toString().trim(),
        lastName: row.lastName.toString().trim(),
        contactEmail: row.contactEmail.toString().trim(),
        contactPhoneNumber: row.contactPhoneNumber.toString().trim(),
      });
    }
  });

  return { validData, invalidData };
}

// Function to add a failed record to invalid data
export function addFailedInsertionToInvalidData(
  invalidData: InvalidRow[],
  record: ValidatedRow,
  originalRowNumber: number,
  error: string
): void {
  invalidData.push({
    rowNumber: originalRowNumber,
    ...record,
    errors: [`Database insertion failed: ${error}`],
  });
}

// Function to create and upload invalid data Excel file
export async function createAndUploadInvalidDataExcel(
  invalidData: InvalidRow[]
): Promise<string> {
  if (invalidData.length === 0) {
    throw new Error("No invalid data to export");
  }

  const tempDir = path.join(process.cwd(), "temp");
  await fs.ensureDir(tempDir);

  const fileName = `invalid-data-${generateUUID()}.xlsx`;
  const filePath = path.join(tempDir, fileName);

  try {
    // Prepare data for Excel export
    const excelData = invalidData.map((row) => ({
      "Row Number": row.rowNumber,
      "First Name": row.firstName || "",
      "Last Name": row.lastName || "",
      "Contact Email": row.contactEmail || "",
      "Contact Phone Number": row.contactPhoneNumber || "",
      Errors: row.errors.join("; "),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Auto-size columns
    const colWidths = [
      { wch: 12 }, // Row Number
      { wch: 30 }, // First Name
      { wch: 30 }, // Last Name
      { wch: 30 }, // Contact Email
      { wch: 20 }, // Contact Phone Number
      { wch: 80 }, // Errors
    ];
    worksheet["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invalid Data");

    // Write file
    XLSX.writeFile(workbook, filePath);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
      public_id: `invalid-data/${fileName.replace(".xlsx", "")}`,
      format: "xlsx",
      folder: "lms",
      expire_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });

    // Clean up temporary file
    await fs.remove(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    // Clean up temporary file on error
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    }

    throw new Error(
      `Failed to create and upload invalid data Excel: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
