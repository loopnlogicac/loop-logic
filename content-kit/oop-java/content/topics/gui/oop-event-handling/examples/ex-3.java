import javax.swing.SwingUtilities;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.JButton;
import javax.swing.JTextField;
import javax.swing.JLabel;
import java.awt.FlowLayout;
import java.awt.BorderLayout;

class Counter {
    private int value;
    void increment() { value++; }
    int value() { return value; }
}

class Main {
    public static void main(String[] args) throws Exception {
        SwingUtilities.invokeLater(() -> {
            Counter model = new Counter();
            JFrame frame = new JFrame("Click counter");
            JButton button = new JButton("Increment");
            JLabel status = new JLabel("0");
            button.addActionListener(event -> {
                model.increment();
                status.setText(Integer.toString(model.value()));
            });
            JPanel panel = new JPanel(new FlowLayout());
            panel.add(button);
            frame.add(status, BorderLayout.PAGE_END);
            frame.add(panel);
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
        });
    }
}
