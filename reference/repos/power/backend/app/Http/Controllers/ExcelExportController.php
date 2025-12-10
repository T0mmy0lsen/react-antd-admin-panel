<?php

namespace App\Http\Controllers;

use App\Models\FormularCreator;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExcelExportController extends Controller
{
    public function formularsByDataistExportExcel(Request $request): BinaryFileResponse
    {
        $request->validate([
            'id' => ['required', 'int']
        ]);

        $dataist = Role::where('name', 'Dataist')->first();
        $formularCreator = FormularCreator::getOneWith($request->id, $dataist->id, []);
        $data = DB::select("select * from view_for_formular_creator_{$formularCreator->id}");

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Check if $data is an array and not empty
        if (is_array($data) && !empty($data)) {
            // Assuming all items have the same keys, use the keys from the first item as headers
            $headers = array_keys(get_object_vars($data[0]));
            $column = 'A'; // Starting at column 'A'
            foreach ($headers as $header) {
                $cellId = $column . '1'; // Header is in the first row
                $sheet->setCellValue($cellId, $header);
                $column++; // Move to the next column
            }
        }

        // Fill data
        $row = 2; // Start from the second row since the first row is for headers
        foreach ($data as $item) {
            $column = 'A'; // Reset to the first column for each new row
            foreach ($item as $key => $value) {
                $cellId = $column . $row;
                $sheet->setCellValue($cellId, $value);
                $column++; // Move to the next column
            }
            $row++; // Move to the next row
        }

        $writer = new Xlsx($spreadsheet);


        // Define the file path and name
        $fileName = 'data.xlsx';
        $temp_file = tempnam(sys_get_temp_dir(), $fileName);

        // Save the file to the server
        $writer->save($temp_file);

        // Return the file as a download response
        return response()->download($temp_file, $fileName, ['Content-Type' => 'application/vnd.ms-excel'])->deleteFileAfterSend();
    }
}
