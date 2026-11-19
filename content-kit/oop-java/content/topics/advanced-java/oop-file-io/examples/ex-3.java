import java.nio.file.Path;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;
import java.io.IOException;

class Main {
    public static void main(String[] args) throws Exception {
        Path directory = Files.createTempDirectory("oop-missing-");
        try {
            try {
                Files.readString(directory.resolve("absent.txt"), StandardCharsets.UTF_8);
            } catch (IOException problem) {
                System.out.println("Cannot read file");
            }
        } finally {
            Files.deleteIfExists(directory);
        }
    }
}
