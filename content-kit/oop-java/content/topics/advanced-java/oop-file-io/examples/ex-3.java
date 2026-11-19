import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.charset.StandardCharsets;
import java.nio.file.NoSuchFileException;



class Main {
    public static void main(String[] args) throws Exception {
        Path directory = Files.createTempDirectory("library-");
        try {
            try {
                Files.readString(directory.resolve("absent.txt"), StandardCharsets.UTF_8);
            } catch (NoSuchFileException failure) {
                System.out.println("File not found");
            }
            System.out.println("Menu continues");
        } finally {
            Files.delete(directory);
        }
    }
}
