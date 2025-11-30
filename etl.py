import csv

csv_path = "RawData.csv" # file path
output_path = "RawData.sql"  # file to write into

with open(csv_path, encoding="utf-8", newline='') as f, open(output_path, "w", encoding="utf-8") as out:
    reader = csv.reader(f)
    header = next(reader) 

    out.write("TRUNCATE TABLE RawData;\n\n")

    sql_template = (
        "INSERT INTO RawData ("
        "Name, Platform, Year_of_Release, Genre, Publisher, "
        "NA_Sales, EU_Sales, JP_Sales, Other_Sales, Global_Sales, "
        "Critic_score, User_score, Developer, Rating"
        ") VALUES ({});\n"
    )

    count = 0
    for row in reader:
        row = [r.replace("'", "''") if r is not None else "NULL" for r in row]

        formatted = ", ".join(
            f"'{v}'" if v != "" else "NULL"
            for v in row
        )

        out.write(sql_template.format(formatted))
        count += 1

print(f"Done! Wrote {count} INSERT statements to {output_path}")
