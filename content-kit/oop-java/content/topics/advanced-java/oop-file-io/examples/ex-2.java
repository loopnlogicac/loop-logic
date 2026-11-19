import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.io.BufferedReader;
import java.io.BufferedWriter;



class Main {
    public static void main(String[] args) throws Exception {
        Path path = Files.createTempFile("report-", ".txt");
        try {
            try (BufferedWriter writer = Files.newBufferedWriter(path, StandardCharsets.UTF_8)) {
                writer.write("CSE 80");
                writer.newLine();
                writer.write("MAT 75");
                writer.newLine();
            }
            try (BufferedReader reader = Files.newBufferedReader(path, StandardCharsets.UTF_8)) {
                String line;
                while ((line = reader.readLine()) != null) { System.out.println(line); }
            }
        } finally {
            Files.deleteIfExists(path);
        }
    }
}
