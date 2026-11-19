import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;

class Main {
    public static void main(String[] args) throws Exception {
        Path file = Files.createTempFile("oop-text-", ".txt");
        try {
            Files.writeString(file, "বই\nCSE\n", StandardCharsets.UTF_8);
            System.out.print(Files.readString(file, StandardCharsets.UTF_8));
        } finally {
            Files.deleteIfExists(file);
        }
    }
}
