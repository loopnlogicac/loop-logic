import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;
import java.io.BufferedReader;
import java.io.BufferedWriter;

class Main {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("oop-lines-", ".txt");
        try {
            try (BufferedWriter writer = Files.newBufferedWriter(file, StandardCharsets.UTF_8)) {
                writer.write("10\n20\n");
            }
            int total = 0;
            try (BufferedReader reader = Files.newBufferedReader(file, StandardCharsets.UTF_8)) {
                String line;
                while ((line = reader.readLine()) != null) { total += Integer.parseInt(line); }
            }
            System.out.println(total);
        } finally {
            Files.deleteIfExists(file);
        }
    }
}
